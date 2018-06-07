import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioDTO } from "../../models/usuario.dto";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";

@Injectable()
export class UsuarioService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    findByEmail(email: string) : Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuarios/email?value=${email}`);
    }

    findByUsernameUnique(username: string) : Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuarios/username?value=${username}`);
    }

    findById(id: string) : Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuarios/${id}`);
    }

    findByUsername(username : string, page : number = 0, linesPerPage : number = 10) {
        return this.http.get(`${API_CONFIG.baseUrl}/usuarios/findByUsername?value=${username}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }

    insert(obj : UsuarioDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/usuarios`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    edit(obj : UsuarioDTO, id) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/usuarios/${id}`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}