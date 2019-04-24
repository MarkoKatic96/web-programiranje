package beans;

public class Vozilo {
	private String id;
	private String marka;
	private String model;
	private String tip;
	private String registarska_oznaka;
	private String godina_proizvodnje;
	private Boolean vozilo_trenutno_u_upotrebi;
	private String napomena;
	private Boolean isDeleted;
	private String korisnikVozila;
	
	public Vozilo(){
		vozilo_trenutno_u_upotrebi=false;
		isDeleted=false;		
	}
	
	public Vozilo(String id, String marka, String model, String tip, String registarska_oznaka, 
			String godina_proizvodnje, String napomena, Boolean isDeleted, Boolean vozilo_trenutno_u_upotrebi, String korisnikVozila){
		this.id=id;
		this.marka=marka;
		this.model=model;
		this.tip=tip;
		this.registarska_oznaka=registarska_oznaka;
		this.godina_proizvodnje=godina_proizvodnje;
		this.vozilo_trenutno_u_upotrebi=vozilo_trenutno_u_upotrebi;
		this.napomena=napomena;
		this.isDeleted=isDeleted;
		this.korisnikVozila=korisnikVozila;
	}

	public String getKorisnikVozila() {
		return korisnikVozila;
	}

	public void setKorisnikVozila(String korisnikVozila) {
		this.korisnikVozila = korisnikVozila;
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

	public String getMarka() {
		return marka;
	}

	public void setMarka(String marka) {
		this.marka = marka;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	public String getRegistarska_oznaka() {
		return registarska_oznaka;
	}

	public void setRegistarska_oznaka(String registarska_oznaka) {
		this.registarska_oznaka = registarska_oznaka;
	}

	public String getGodina_proizvodnje() {
		return godina_proizvodnje;
	}

	public void setGodina_proizvodnje(String godina_proizvodnje) {
		this.godina_proizvodnje = godina_proizvodnje;
	}

	public Boolean getVozilo_trenutno_u_upotrebi() {
		return vozilo_trenutno_u_upotrebi;
	}

	public void setVozilo_trenutno_u_upotrebi(Boolean vozilo_trenutno_u_upotrebi) {
		this.vozilo_trenutno_u_upotrebi = vozilo_trenutno_u_upotrebi;
	}

	public String getNapomena() {
		return napomena;
	}

	public void setNapomena(String napomena) {
		this.napomena = napomena;
	}
	
	
}
