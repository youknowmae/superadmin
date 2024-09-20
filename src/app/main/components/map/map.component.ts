import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']  // Fix typo here
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  display: google.maps.LatLngLiteral | undefined;
  map!: google.maps.Map;

  ngAfterViewInit(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 40.73061, lng: -73.935242 },
      zoom: 12,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.display = event.latLng.toJSON();
      }
    });
  }
}
