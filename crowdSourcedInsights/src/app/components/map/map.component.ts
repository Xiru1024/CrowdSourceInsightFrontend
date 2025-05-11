import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  Renderer2,
} from '@angular/core';
import * as L from 'leaflet';
import { DrawerModule } from 'primeng/drawer';
import { Browser, Map, map, tileLayer } from 'leaflet';
import { InsightCreationPopComponent } from '../insight-creation-pop/insight-creation-pop.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { InsightDetailComponent } from '../insight-detail/insight-detail.component';

@Component({
  selector: 'app-map',
  imports: [DrawerModule, InsightCreationPopComponent, CommonModule, InsightDetailComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  public sidePananelVisible: boolean = false;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('contextMenu')
  private contextMenu!: ElementRef<HTMLElement>;
  private markers: L.Marker[] = [];

  private leafletMap!: Map;
  public dialogVisible: boolean = false;
  public lat_long: any = {};
  public mapBounds: any = {};
  public customIcon: any;
  public currentInsight: any = null;

  constructor(
    private renderer: Renderer2,
    private http: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const initialState = { lng: 11, lat: 49, zoom: 4 };

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
    } as any).addTo(this.leafletMap);
    this.leafletMap.on('contextmenu', (event: any) =>
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
  showContextMenu(event: any) {
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

  onMenuItemClick(option: string) {
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
        this.updateMarkers(response.body?.items || []);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch insights',
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

  updateMarkers(insights: any[]) {
    this.markers.forEach((marker) => this.leafletMap.removeLayer(marker));
    this.markers = [];
    if (this.leafletMap) {
      insights.forEach((insight: any) => {

        const popupContent = `
        <div>
          <strong>${insight.title}</strong><br>
          <button type="button" class="btn btn-link" id="show-detail-${insight.id}">Show Detail>></button>
        </div>
      `;

        const marker = L.marker([insight.latitude, insight.longitude], {
          icon: this.customIcon,
        }).addTo(this.leafletMap);
        marker.bindPopup(popupContent);


        marker.on('popupopen', () => {
        const btn = document.getElementById(`show-detail-${insight.id}`);
        if (btn) {
          btn.onclick = () => this.showInsightDetail(insight);
        }
      });

      });
    }
  }

  showInsightDetail(insight: any) {
    this.currentInsight = insight;
    this.sidePananelVisible = true;
  }
}
