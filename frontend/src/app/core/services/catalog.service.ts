import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CareerDto, PeriodDto } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getCareers() {
    return this.http.get<CareerDto[]>(`${this.baseUrl}/careers`);
  }

  getPeriods() {
    return this.http.get<PeriodDto[]>(`${this.baseUrl}/periods`);
  }
}
