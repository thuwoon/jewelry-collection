import { HttpHeaders } from '@angular/common/http';
export const Headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Headers" :"cache-control",
    'Origin': 'http://localhost:4200',
    // 'Authorization': 'Bearer YourAccessTokenHere' // Add any authentication token if required
  });