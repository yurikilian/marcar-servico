export interface AvailableDistrict {
  name: string;
  value: string;
  localities: AvailableLocality[];
}

export interface AvailableLocality {
  name: string;
  value: string;
  places: AvailableAttendancePlace[];
}

export interface AvailableAttendancePlace {
  name: string;
  value: string;
}
