import { Injectable, inject } from '@angular/core';
import{ HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'https://opendata.edf.fr/api/explore/v2.1/catalog/datasets'
@Injectable({
  providedIn: 'root'
})
export class DatasetsService {
  http = inject(HttpClient)
  getDatasetAllRecords(dataset_id: string): Observable<any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/records`)
  }
  getDatasetExportFormats(dataset_id: string): Observable<any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/exports`)
  }
  getExportDataset(dataset_id: string, format: string): Observable<any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/export/${format}`)
  }
  getExportDatasetCSV(dataset_id: string): Observable<any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/export/csv`)
  } 
  getExportDatasetGPX(dataset_id: string, format: string): Observable<any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/export/gpx`)
  }
  getDatasetFacets(dataset_id: string): Observable <any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/facets`)
  }
  getDatasetAttachements(dataset_id: string): Observable <any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/attachements`)
  }
  getDatasetReocrd(dataset_id: string, record_id: string): Observable <any>{
    return this.http.get(`${baseUrl}/datasets/${dataset_id}/records/${record_id}`)
  }
}
