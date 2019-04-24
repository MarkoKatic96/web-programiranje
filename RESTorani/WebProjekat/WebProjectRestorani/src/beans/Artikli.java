package beans;

public class Artikli {
	
	private String naziv;
	private String tip;
	private int cena;
	private String opis;
	private String kolicina;
	private String id;
	private String idRestorana;
	private Boolean isDeleted;
	private String broj_u_por;
	private int brojProdanih;

	public Artikli(){
		broj_u_por="";
		brojProdanih=0;
	}

	public Artikli(String id, String tip, String naziv, int cena, String opis, String kolicina, String idRestorana, Boolean isDeleted){
		this.id=id;
		this.tip=tip;
		this.naziv=naziv;
		this.cena=cena;
		this.opis=opis;
		this.kolicina=kolicina;
		this.idRestorana=idRestorana;
		this.isDeleted=isDeleted;
	}
	
	public String getBroj_u_por() {
		return broj_u_por;
	}

	public void setBroj_u_por(String broj_u_por) {
		this.broj_u_por = broj_u_por;
	}
	
	public String getIdRestorana() {
		return idRestorana;
	}

	public void setIdRestorana(String idRestorana) {
		this.idRestorana = idRestorana;
	}

	public Boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public int getCena() {
		return cena;
	}

	public void setCena(int cena) {
		this.cena = cena;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public String getKolicina() {
		return kolicina;
	}

	public void setKolicina(String kolicina) {
		this.kolicina = kolicina;
	}

	public int getBrojProdanih() {
		return brojProdanih;
	}

	public void setBrojProdanih(int brojProdanih) {
		this.brojProdanih = brojProdanih;
	}	
}
