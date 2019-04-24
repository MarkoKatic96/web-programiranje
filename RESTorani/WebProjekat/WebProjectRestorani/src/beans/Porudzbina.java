package beans;

import java.util.ArrayList;
import java.util.List;

public class Porudzbina {
	private String id;
	private List<Artikli> stavke;
	private int kolicina;
	private String datum_i_vreme_porudzbine;
	private String kupac;
	private String dostavljac;
	private String status_porudzbine;
	private String napomena;
	private int cena_porudzbine;
	private Boolean isDeleted;
	
	public Porudzbina(){
		status_porudzbine="";
		isDeleted=false;
		stavke=new ArrayList<Artikli>();
		cena_porudzbine=0;
	}
	
	public Boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public Porudzbina(String id, List<Artikli> stavke, int kolicina, String datum_i_vreme,
			String kupac, String dostavljac, String status_porudzbine, String napomena, int cena_porudzbine){
		this.stavke=stavke;
		this.kolicina=kolicina;
		this.datum_i_vreme_porudzbine=datum_i_vreme;
		this.kupac=kupac;
		this.dostavljac=dostavljac;
		this.status_porudzbine=status_porudzbine;
		this.napomena=napomena;	
		this.id=id;
		this.cena_porudzbine=cena_porudzbine;
	}

	public int getCena_porudzbine() {
		return cena_porudzbine;
	}

	public void setCena_porudzbine(int cena_porudzbine) {
		this.cena_porudzbine = cena_porudzbine;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<Artikli> getStavke() {
		return stavke;
	}

	public void setStavke(List<Artikli> stavke) {
		this.stavke = stavke;
	}

	public int getKolicina() {
		return kolicina;
	}

	public void setKolicina(int kolicina) {
		this.kolicina = kolicina;
	}

	public String getDatum_i_vreme_porudzbine() {
		return datum_i_vreme_porudzbine;
	}

	public void setDatum_i_vreme_porudzbine(String datum_i_vreme_porudzbine) {
		this.datum_i_vreme_porudzbine = datum_i_vreme_porudzbine;
	}

	public String getKupac() {
		return kupac;
	}

	public void setKupac(String kupac) {
		this.kupac = kupac;
	}

	public String getDostavljac() {
		return dostavljac;
	}

	public void setDostavljac(String dostavljac) {
		this.dostavljac = dostavljac;
	}

	public String getStatus_porudzbine() {
		return status_porudzbine;
	}

	public void setStatus_porudzbine(String status_porudzbine) {
		this.status_porudzbine = status_porudzbine;
	}

	public String getNapomena() {
		return napomena;
	}

	public void setNapomena(String napomena) {
		this.napomena = napomena;
	}
}
