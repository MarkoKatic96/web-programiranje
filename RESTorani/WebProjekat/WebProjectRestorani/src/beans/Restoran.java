package beans;

import java.util.List;

public class Restoran {
	private String id;
	private String naziv;
	private String adresa;
	private String kategorija;
	private List<Artikli> lista_jela;
	private List<Artikli> lista_pica;
	private Boolean isDeleted;
	
	public Restoran(){
		
	}
	
	public Restoran(String id, String naziv, String adresa, String kategorija, Boolean isDeleted, List<Artikli> lista_jela,
			List<Artikli> lista_pica){
		this.id=id;
		this.naziv=naziv;
		this.adresa=adresa;
		this.kategorija=kategorija;
		this.lista_jela=lista_jela;
		this.lista_pica=lista_pica;
		this.isDeleted=isDeleted;
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

	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public String getAdresa() {
		return adresa;
	}

	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}

	public String getKategorija() {
		return kategorija;
	}

	public void setKategorija(String kategorija) {
		this.kategorija = kategorija;
	}

	public List<Artikli> getLista_jela() {
		return lista_jela;
	}

	public void setLista_jela(List<Artikli> lista_jela) {
		this.lista_jela = lista_jela;
	}

	public List<Artikli> getLista_pica() {
		return lista_pica;
	}

	public void setLista_pica(List<Artikli> lista_pica) {
		this.lista_pica = lista_pica;
	}
	
}
