import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from "angular2-jwt";

@Injectable()
export class AuthService{

    jwtHelper : JwtHelper  = new JwtHelper();
     
    constructor(public http : HttpClient, public storage : StorageService){

    }

    authentication(creds : CredenciaisDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    refreshToken(){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    successfulLogin(authorizationValeu : string){
        let tok = authorizationValeu.substring(7);
        let user : LocalUser = {
            token : tok,
            username : this.jwtHelper.decodeToken(tok).sub
        }
        this.storage.setLocalUser(user);
    }

    logout(){
        this.storage.setLocalUser(null);
    }
}