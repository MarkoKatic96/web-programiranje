package beans;

import java.util.ArrayList;
import java.util.List;

public class Kupac {
	private String korisnicko_ime;
	private String lozinka;
	private String ime;
	private String prezime;
	private String uloga;
	private String kontakt_telefon;
	private String email;
	private String datum_registracije;
	private int bodovi;
	private List<Artikli> lista_stavki;
	private List<Porudzbina> lista_porudzbina;
	private List<Restoran> lista_omiljenih_restorana;
	
	public Kupac(){
		lista_omiljenih_restorana=new ArrayList<Restoran>();
		lista_porudzbina=new ArrayList<Porudzbina>();
		lista_stavki=new ArrayList<Artikli>();
		bodovi=0;
	}
	
	public Kupac(String korisnicko_ime, String lozinka, String ime, String prezime, 
			String uloga, String kontakt_telefon, String email, String datum_registracije,
			List<Porudzbina> lista_porudzbina, List<Restoran> lista_omiljenih_restorana, int bodovi){
		this.korisnicko_ime=korisnicko_ime;
		this.lozinka=lozinka;
		this.ime=ime;
		this.prezime=prezime;
		this.uloga=uloga;
		this.kontakt_telefon=kontakt_telefon;
		this.email=email;
		this.datum_registracije=datum_registracije;
		this.lista_porudzbina=lista_porudzbina;
		this.lista_omiljenih_restorana=lista_omiljenih_restorana;
		this.bodovi=bodovi;
	}

	public int getBodovi() {
		return bodovi;
	}

	public void setBodovi(int bodovi) {
		this.bodovi = bodovi;
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

	public List<Artikli> getLista_stavki() {
		return lista_stavki;
	}

	public void setLista_stavki(List<Artikli> lista_stavki) {
		this.lista_stavki = lista_stavki;
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

	public List<Porudzbina> getLista_porudzbina() {
		return lista_porudzbina;
	}

	public void setLista_porudzbina(List<Porudzbina> lista_porudzbina) {
		this.lista_porudzbina = lista_porudzbina;
	}

	public List<Restoran> getLista_omiljenih_restorana() {
		return lista_omiljenih_restorana;
	}

	public void setLista_omiljenih_restorana(List<Restoran> lista_omiljenih_restorana) {
		this.lista_omiljenih_restorana = lista_omiljenih_restorana;
	}

}
