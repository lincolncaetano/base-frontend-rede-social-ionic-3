import { List } from "ionic-angular";

export interface UsuarioDTO{
    id : string;
    nome: string;
    username: string;
    email: string;
    descricao: string;
    sexo: string;
    nascimento: string;
    qtdSeguidores: string;
    qtdSeguidos: string;
    imageUrl? : string;
}