import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { Browser, Map, map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [DrawerModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  public sidePananelVisible: boolean = false;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('contextMenu')
  private contextMenu!: ElementRef<HTMLElement>;

  private leafletMap!: Map;

  constructor(private renderer: Renderer2) {}

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
      id: 'osm-bright',
    } as any).addTo(this.leafletMap);
    this.leafletMap.on('contextmenu', (event: any) => this.showContextMenu(event));
  }

  toggleDrawer() {
    this.sidePananelVisible = !this.sidePananelVisible; // Toggle the drawer visibility
  }
  showContextMenu(event: any) {
    const { containerPoint } = event;

    // Position the context menu
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
    // Handle menu item click
    console.log('Menu item clicked');
    this.hideContextMenu();
  }
}
