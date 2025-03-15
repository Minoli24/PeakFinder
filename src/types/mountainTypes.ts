export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Marker {
  latitude: number;
  longitude: number;
}

export interface TravelMethods {
  carMins: number;
  bikeMins: number;
  footMins: number;
  bicycleMins: number;
}

export interface Path {
  pathId: string;
  pathName: string;
  pathDescription: string;
  travelMethods: TravelMethods;
  bioDiversity: string;
  distance: string;
  permission: string;
  specialPlaces: string;
  markers: Marker[];
}

export interface Mountain {
  mountainId: string;
  mountainName: string;
  mainImage: string;
  mountainDescription: string;
  carouselImages: string[];
  initialLongLat: Region;
  paths: Path[];
}
