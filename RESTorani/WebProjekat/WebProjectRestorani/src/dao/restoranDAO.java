package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


import beans.Restoran;


public class restoranDAO {

	private HashMap<String, Restoran> restoraniMap = new HashMap<String, Restoran>();
	private String context;
	
	public restoranDAO(){
		
	}
	
	public restoranDAO(String contextPath){
		this.context=contextPath;
		loadRestorane(contextPath);
	}
	
	public Collection<Restoran> findAllRestorane(){
		return restoraniMap.values();
	}
	
	public Restoran findRestoran(String id) {
		return restoraniMap.containsKey(id) ? restoraniMap.get(id) : null;
	}
	
	public void snimiRestorane() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, restoraniMap);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(context + "/restorani.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista restorana." + restoraniMap.size());
	    } catch(IOException ioe) {
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
	
	public Collection<Restoran> dodajNoviRestoran(Restoran restoran) throws IOException {

		Integer maxId = -1;
		for (String id : restoraniMap.keySet()) {
			int idNum =Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		restoran.setId(maxId.toString());
		
		restoraniMap.put(restoran.getId(), restoran);
		snimiRestorane();
		
		return restoraniMap.values();
	}
	
	private void loadRestorane(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 restoraniMap= mapper.readValue(new File(contextPath + "/restorani.txt"), new TypeReference<HashMap<String, Restoran>>() {});
			} catch (IOException e) {
				restoraniMap = new HashMap<String,Restoran>();
			}
		System.out.println("broj restorana je " + restoraniMap.size()+".");
	}
	
	public Collection<Restoran> deleteRestoran(String restoran) throws IOException {
		for(Restoran item : restoraniMap.values()){
			if(item.getId().equals(restoran)){
				item.setIsDeleted(true);
				snimiRestorane();
				break;
			}
		}
		
		return restoraniMap.values();
	}
	
	public Collection<Restoran> editRestoran(Restoran restoran) throws IOException {
		Restoran r = findRestoran(restoran.getId());
		r.setNaziv(restoran.getNaziv());
		r.setAdresa(restoran.getAdresa());
		r.setKategorija(restoran.getKategorija());
		r.setLista_jela(restoran.getLista_jela());
		r.setLista_pica(restoran.getLista_pica());
		
		snimiRestorane();
		
		
		return restoraniMap.values();
	}
	
	
}
