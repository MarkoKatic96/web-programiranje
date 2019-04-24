package beans;

public class Admin {
	private String korisnicko_ime;
	private String lozinka;
	private String ime;
	private String prezime;
	private String uloga;
	private String kontakt_telefon;
	private String email;
	private String datum_registracije;
	
	public Admin(){
		
	}
	
	public Admin(String korisnicko_ime, String lozinka, String ime, String prezime, 
			String uloga, String kontakt_telefon, String email, String datum_registracije){
		this.korisnicko_ime=korisnicko_ime;
		this.lozinka=lozinka;
		this.ime=ime;
		this.prezime=prezime;
		this.uloga=uloga;
		this.kontakt_telefon=kontakt_telefon;
		this.email=email;
		this.datum_registracije=datum_registracije;
	}

	public String getKorisnicko_ime() {
		return korisnicko_ime;
	}

	public void setKorisnicko_ime(String korisnicko_ime) {
		this.korisnicko_ime = korisnicko_ime;
	}

	public String getLozinka() {
		return lozinka;
	}

	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
	}

	public String getPrezime() {
		return prezime;
	}

	public void setPrezime(String prezime) {
		this.prezime = prezime;
	}

	public String getUloga() {
		return uloga;
	}

	public void setUloga(String uloga) {
		this.uloga = uloga;
	}

	public String getKontakt_telefon() {
		return kontakt_telefon;
	}

	public void setKontakt_telefon(String kontakt_telefon) {
		this.kontakt_telefon = kontakt_telefon;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDatum_registracije() {
		return datum_registracije;
	}

	public void setDatum_registracije(String datum_registracije) {
		this.datum_registracije = datum_registracije;
	}
	
}
