export class ClaimBenefParamRequest{
    SPATERNAL_LASTNAME  :   string;
    SMATERNAL_LASTNAME  :   string;
    SNAME               :   string;
    SNRODOCUMENT        :   string;

    constructor(){
        this.SPATERNAL_LASTNAME = "";
        this.SMATERNAL_LASTNAME = "";
        this.SNAME              = "";
        this.SNRODOCUMENT       = "";
    }
}