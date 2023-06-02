export class GenericResponse {
    numCase         :   number;
    Message         :   string;
    GenericResponse :   any[];
    TotalRowNumber  :   number;

    constructor(){
        this.GenericResponse = []
    }
}