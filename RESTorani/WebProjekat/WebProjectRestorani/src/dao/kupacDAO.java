package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikli;
import beans.Kupac;
import beans.Restoran;

public class kupacDAO {
	
	private HashMap<String, Kupac> kupci = new HashMap<String, Kupac>();
	private String context;
	
	public kupacDAO(){
		
	}
	
	public kupacDAO(String contextPath){
		this.context=contextPath;
		loadKupce(contextPath);
	}
	
	public Kupac find(String username, String password) {
		if (!kupci.containsKey(username)) {
			return null;
		}
		Kupac user = kupci.get(username);
		if (!user.getLozinka().equals(password)) {
			return null;
		}
		return user;
	}
	
	public Kupac findKupca(String id) {
		if(kupci.containsKey(id)){		
			Kupac k=kupci.get(id);
			return k;
		}else{
			return null;
		}
	}
	public Collection<Kupac> findAll(){
		return kupci.values();
	}
	
	public void snimiKupca() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, kupci);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(context + "/korisnici.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista kupaca." + kupci.size());
	    } catch(IOException ioe) {
	        // Handle exception here
	        ioe.printStackTrace();
	    } finally {
	        try {
	        	if (fos!=null)
	        		fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	    }
	
	}
	
	public Collection<Kupac> dodajNovogKupca(Kupac kupac) throws IOException {
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		Date date = new Date();
		kupac.setDatum_registracije(dateFormat.format(date));
		if(kupci.size()==0){
			kupac.setUloga("admin");
		}else{
			kupac.setUloga("kupac");
		}
		kupci.put(kupac.getKorisnicko_ime(), kupac);
		snimiKupca();
		
		return kupci.values();
	}
	
	private void loadKupce(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 kupci = mapper.readValue(new File(contextPath + "/korisnici.txt"), new TypeReference<HashMap<String, Kupac>>() {});
			 System.out.println("broj kupaca je t" + kupci.size()+".");
			} catch (IOException e) {
				kupci = new HashMap<String, Kupac>();
				System.out.println("broj kupaca je c" + kupci.size()+".");
			}
		System.out.println("broj kupaca je " + kupci.size()+".");
	}
	
	public Collection<Kupac> editKupca(Kupac kupac) throws IOException {
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		r.setUloga(kupac.getUloga());
		
		snimiKupca();
		
		
		return kupci.values();
	}
	
	public void dodajUListuOmiljenih(Kupac kupac, Restoran restoran) throws IOException {
		//String vrati ="";
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		r.getLista_omiljenih_restorana().add(restoran);		
		
		snimiKupca();
	}
	
	public Collection<Restoran> izbaciIzListeOmiljenih(Kupac kupac, Restoran restoran) throws IOException {
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		List<Restoran> lr=new ArrayList<Restoran>();
		for(int j=0; j<r.getLista_omiljenih_restorana().size(); j++){
			lr.add(r.getLista_omiljenih_restorana().get(j));
		}
		r.getLista_omiljenih_restorana().clear();
		for(int i=0; i<lr.size(); i++){
			if(!(lr.get(i).getId().equals(restoran.getId()))){
				r.getLista_omiljenih_restorana().add(lr.get(i));
			}
		}
		
		snimiKupca();
		return r.getLista_omiljenih_restorana();	
	}
	
	public void dodajUListuStavki(Kupac kupac, Artikli artikal) throws IOException {
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		r.getLista_stavki().add(artikal);		
	}
	
	public Collection<Artikli> izbaciIzListeStavki(Kupac kupac, Artikli artikal) throws IOException {
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		List<Artikli> lr=new ArrayList<Artikli>();
		for(int j=0; j<r.getLista_stavki().size(); j++){
			lr.add(r.getLista_stavki().get(j));
		}
		r.getLista_stavki().clear();
		for(int i=0; i<lr.size(); i++){
			if(lr.get(i).getId().equals(artikal.getId())){
				lr.remove(i);
				break;
			}
		}
		for(int i=0; i<lr.size(); i++){
			r.getLista_stavki().add(lr.get(i));
		}
		System.out.println(r.getLista_stavki().size());
		return r.getLista_stavki();
	}
	
	public Collection<Artikli> izbaciSveStavke(Kupac kupac, Artikli artikal) throws IOException {
		Kupac r = findKupca(kupac.getKorisnicko_ime());
		r.getLista_stavki().clear();
		return r.getLista_stavki();
	}
	
	public void dodajBod(String id) throws IOException {
		Kupac r = findKupca(id);
		if(r.getBodovi()<10){
			int a=r.getBodovi()+1;
			r.setBodovi(a);
			snimiKupca();
		}
	}
	
	public int oduzmiBod(String id, String b) throws IOException {
		Kupac r = findKupca(id);
		int a=r.getBodovi()-Integer.parseInt(b);
		r.setBodovi(a);
		snimiKupca();
		return r.getBodovi();				
	}
	
}
