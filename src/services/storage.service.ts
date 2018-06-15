import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";

@Injectable()
export class StorageService{

    getLocalUser() : LocalUser{
        let usr = localStorage.getItem(STORAGE_KEYS.localUser);
        if(usr == null){
            return null;
        }else{
            return JSON.parse(usr)
        }
    }

    setLocalUser(obj : LocalUser) {
        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }else{
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }

    setIdioma(idioma : String){
        localStorage.setItem(STORAGE_KEYS.localIdioma, JSON.stringify(idioma));
    }
    getLocaIdioma() : String{
        let idioma = localStorage.getItem(STORAGE_KEYS.localIdioma);
        if(idioma == null){
            return JSON.parse('en')
        }else{
            return JSON.parse(idioma);
        }
    }
}