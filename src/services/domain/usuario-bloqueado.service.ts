import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioDTO } from "../../models/usuario.dto";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { UsuarioBloqueadoDTO } from "../../models/usuarioBloqueado.dto";

@Injectable()
export class UsuarioBloqueadoService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    findById(id: string) : Observable<UsuarioBloqueadoDTO> {
        return this.http.get<UsuarioBloqueadoDTO>(`${API_CONFIG.baseUrl}/usuarioBloqueado/${id}`);
    }

    findBloqueadosPorUsuario(id: string) : Observable<UsuarioDTO[]>  {
        return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarioBloqueado/listaPorUsuario/${id}`);
    }

    insert(obj : UsuarioBloqueadoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/usuarioBloqueado`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    delete(obj : UsuarioBloqueadoDTO) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/usuarioBloqueado/${obj.usuarioId}/${obj.usuarioBloqueadoId}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}