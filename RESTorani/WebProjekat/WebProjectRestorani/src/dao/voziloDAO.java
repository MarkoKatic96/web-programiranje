package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Vozilo;

public class voziloDAO {

	private HashMap<String, Vozilo> vozilaMap = new HashMap<String, Vozilo>();
	private String context;
	
	public voziloDAO(){
		
	}
	
	public voziloDAO(String contextPath){
		this.context=contextPath;
		loadVozila(contextPath);
	}
	
	public Collection<Vozilo> findAllVozila(){
		return vozilaMap.values();
	}
	
	
	public Vozilo findVozilo(String id) {
		return vozilaMap.containsKey(id) ? vozilaMap.get(id) : null;
	}
	
	public void snimiVozila() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, vozilaMap);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(context + "/vozila.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista vozila." + vozilaMap.size());
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
	
	public Collection<Vozilo> dodajNovoVozilo(Vozilo vozilo) throws IOException {

		Integer maxId = -1;
		for (String id : vozilaMap.keySet()) {
			int idNum =Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		vozilo.setId(maxId.toString());

		vozilaMap.put(vozilo.getId(), vozilo);
		snimiVozila();
		
		return vozilaMap.values();
	}
	
	private void loadVozila(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 vozilaMap = mapper.readValue(new File(context + "/vozila.txt"), new TypeReference<HashMap<String, Vozilo>>() {});
			 System.out.println("broj vozila je try " + vozilaMap.size()+".");
			} catch (IOException e) {
				vozilaMap = new HashMap<String,Vozilo>();
				System.out.println("broj vozila je catch" + vozilaMap.size()+".");
			}
		System.out.println("broj vozila je " + vozilaMap.size()+".");

	}
	
	public Collection<Vozilo> deleteVozilo(String vozilo) throws IOException {
		//trazimo vozilo
		for(Vozilo item : vozilaMap.values()){
			if(item.getId().equals(vozilo)){
				item.setIsDeleted(true);
				snimiVozila();
				break;
			}
		}
		
		return vozilaMap.values();
	}
	
	public Collection<Vozilo> editVozilo(Vozilo vozilo) throws IOException {
		Vozilo r = findVozilo(vozilo.getId());
		r.setMarka(vozilo.getMarka());
		r.setModel(vozilo.getModel());
		r.setTip(vozilo.getTip());
		r.setRegistarska_oznaka(vozilo.getRegistarska_oznaka());
		r.setGodina_proizvodnje(vozilo.getGodina_proizvodnje());
		r.setNapomena(vozilo.getNapomena());
		r.setKorisnikVozila(vozilo.getKorisnikVozila());
		
		snimiVozila();		
		
		return vozilaMap.values();
	}

	public void zauzmiVoziloD(String id) throws IOException {
		Vozilo r = findVozilo(id);
		r.setVozilo_trenutno_u_upotrebi(true);
		
		snimiVozila();		
	}
	
	public void oslobodiVoziloD(String id) throws IOException {
		Vozilo r = findVozilo(id);
		r.setVozilo_trenutno_u_upotrebi(false);
		
		snimiVozila();		
	}
}
