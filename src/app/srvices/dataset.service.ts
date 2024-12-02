import { Injectable, inject } from '@angular/core';
import{ HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'https://opendata.edf.fr/api/explore/v2.1/catalog/datasets'
@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  http = inject(HttpClient)
  getDatasetAllRecords(dataset_id: string): Observable<any>{
      const params = new HttpParams()
        .set('limit', '100')
        .set('offset', '0')
        .set('include_links', 'false')
        .set('include_app_metas', 'false');
    return this.http.get(`${baseUrl}/${dataset_id}/records`, {params})
  };
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
