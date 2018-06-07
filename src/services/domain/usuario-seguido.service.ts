import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioDTO } from "../../models/usuario.dto";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { UsuarioSeguidoDTO } from "../../models/usuarioSeguido.dto";

@Injectable()
export class UsuarioSeguidoService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    findById(id: string) : Observable<UsuarioSeguidoDTO> {
        return this.http.get<UsuarioSeguidoDTO>(`${API_CONFIG.baseUrl}/usuarioSeguido/${id}`);
    }

    findListaSeguindo(id: string) : Observable<UsuarioDTO[]>  {
        return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarioSeguido/listaSeguindo/${id}`);
    }

    findListaSeguidores(id: string) : Observable<UsuarioDTO[]>  {
        return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarioSeguido/listaSeguidores/${id}`);
    }

    isSeguido(idUsuario: string, idUsuarioLogado: string) : Observable<boolean>{
        return this.http.get<boolean>(`${API_CONFIG.baseUrl}/usuarioSeguido/isSegue?idUsuario=${idUsuario}&idUsuarioLogado=${idUsuarioLogado}`);
    }

    insert(obj : UsuarioSeguidoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/usuarioSeguido`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    delete(obj : UsuarioSeguidoDTO) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/usuarioSeguido/${obj.usuarioId}/${obj.usuarioSeguidoId}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}