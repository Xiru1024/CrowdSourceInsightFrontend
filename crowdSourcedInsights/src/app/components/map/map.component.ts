/**
 * MapComponent
 * ------------
 * This component displays an interactive Leaflet map with insight markers and context menu actions.
 * 
 * Main Functions:
 * - Initializes and displays a Leaflet map.
 * - Fetches and displays insights as markers on the map.
 * - Handles context menu for adding new insights at a location.
 * - Allows viewing, editing, and deleting insight details via a side panel.
 * 
 */

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import * as L from 'leaflet';
import { DrawerModule } from 'primeng/drawer';
import { Browser, Icon, LeafletMouseEvent, Map, map, tileLayer, TileLayerOptions } from 'leaflet';
import { InsightCreationPopComponent } from '../insight-creation-pop/insight-creation-pop.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/httpService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InsightDetailComponent } from '../insight-detail/insight-detail.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IInsight } from '../../models/models';

@Component({
  selector: 'app-map',
  imports: [
    DrawerModule,
    InsightCreationPopComponent,
    CommonModule,
    InsightDetailComponent,
    ConfirmPopupModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  public sidePananelVisible = false;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('contextMenu')
  private contextMenu!: ElementRef<HTMLElement>;
  private markers: L.Marker[] = [];
  public showAction = false;

  private leafletMap!: Map;
  public dialogVisible = false;
  public lat_long: {
    latitude?: number;
    longitude?: number;
  } = {};
  public mapBounds = '';
  public customIcon!: Icon;
  public currentInsight: IInsight | null = null;
  public isEdit = false;

  constructor(
    private renderer: Renderer2,
    private http: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  ngAfterViewInit() {
    const initialState = { lng: 11, lat: 49, zoom: 4 };

    // Initialize the map, refered to this source: https://www.geoapify.com/tutorial/angular-leaflet-mapbox-maplibre-openlayers/#angular-leaflet

    this.leafletMap = map(this.mapContainer.nativeElement).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    const isRetina = Browser.retina;
    const baseUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}';
    const retinaUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}';

    tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      apiKey: '50023782157049cd9b7e6f74ef079e5d',
      maxZoom: 20,
      minZoom: 3,
      id: 'osm-bright',
    } as TileLayerOptions).addTo(this.leafletMap);
    this.leafletMap.on('contextmenu', (event: LeafletMouseEvent) =>
      this.showContextMenu(event)
    );

    this.customIcon = L.icon({
      iconUrl:
        'https://api.geoapify.com/v2/icon/?type=awesome&color=red&size=22&strokeColor=%23512424&shadowColor=%23512424&contentColor=%23512424&noShadow&scaleFactor=2&apiKey=50023782157049cd9b7e6f74ef079e5d',
      iconSize: [18, 25],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    this.leafletMap.on('moveend', () => {
      this.getMapBounds();
      this.getAllInsights();
    });

    this.getMapBounds();
    this.getAllInsights();
  }

  toggleDrawer() {
    this.sidePananelVisible = !this.sidePananelVisible;
  }
  showContextMenu(event: LeafletMouseEvent) {
    const { containerPoint, latlng } = event;
    this.lat_long = {
      latitude: latlng.lat,
      longitude: latlng.lng,
    };

    this.renderer.setStyle(
      this.contextMenu.nativeElement,
      'top',
      `${containerPoint.y}px`
    );
    this.renderer.setStyle(
      this.contextMenu.nativeElement,
      'left',
      `${containerPoint.x}px`
    );
    this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'block');
  }

  hideContextMenu() {
    this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'none');
  }

  onMenuItemClick() {
    this.isEdit = false;
    this.hideContextMenu();

    this.showDialog();
  }

  showDialog() {
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
  }

  getMapBounds() {
    if (this.leafletMap) {
      const bounds = this.leafletMap.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();

      const latMin = southWest.lat;
      const latMax = northEast.lat;
      const lngMin = southWest.lng;
      const lngMax = northEast.lng;
      const box = [lngMin, latMin, lngMax, latMax];

      this.mapBounds = box.join(',');
    }
  }

  getAllInsights() {
    this.http.getInsights({ bbox: this.mapBounds }).subscribe({
      next: (response) => {
        this.updateMarkers(response.body?.["items"] || []);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  handleClosePopup(newInsight: boolean) {
    this.dialogVisible = false;
    if (newInsight) {
      this.getAllInsights();
    }
  }

  updateMarkers(insights: IInsight[]) {
    this.markers.forEach((marker) => this.leafletMap.removeLayer(marker));
    this.markers = [];
    if (this.leafletMap) {
      insights.forEach((insight: IInsight) => {
        const popupContent = `
        <div>
          <strong>${insight.title}</strong><br>
          <button type="button" class="btn btn-link" id="show-detail-${insight.id}">Show Detail>></button>
        </div>
      `;

        const marker = L.marker([insight.latitude??0, insight.longitude??0], {
          icon: this.customIcon,
        }).addTo(this.leafletMap);
        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`show-detail-${insight.id}`);
          if (btn) {
            btn.onclick = () => this.showInsightDetail(insight);
          }
        });
        this.markers.push(marker);
      });
    }
  }

  showInsightDetail(insight: IInsight) {
    this.showAction =
      localStorage.getItem('username') == insight?.user;
    this.currentInsight = insight;
    this.sidePananelVisible = true;
  }

  deleteInsight(event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to DELETE?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        this.handleDelete();
      },
    });
  }
  handleDelete() {
    if (this.currentInsight) {
      this.http
        .deleteInsight(
          localStorage.getItem('username') as string,
          this.currentInsight.id??''
        )
        .subscribe({
          next: () => {
            this.currentInsight = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Insight deleted successfully',
            });
            this.sidePananelVisible = false;
            this.getAllInsights();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
    }
  }

  openEditInsight() {
    if (this.currentInsight) {
      this.isEdit = true;
      this.lat_long = {
        latitude: this.currentInsight.latitude,
        longitude: this.currentInsight.longitude,
      };
      this.sidePananelVisible = false;
      this.dialogVisible = true;
    }
  }
}
