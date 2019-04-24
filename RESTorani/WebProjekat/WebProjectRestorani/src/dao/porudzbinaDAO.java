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
import beans.Porudzbina;


public class porudzbinaDAO {
	private HashMap<String, Porudzbina> porudzbineMap = new HashMap<String, Porudzbina>();
	private String context;
	
	public porudzbinaDAO(){
		
	}
	
	public Collection<Porudzbina> findAllPorudzbine(){
		return porudzbineMap.values();
	}
	
	public Porudzbina findPorudzbina(String id) {
		return porudzbineMap.containsKey(id) ? porudzbineMap.get(id) : null;
	}
		
	public porudzbinaDAO(String contextPath){
		this.context=contextPath;
		loadPorudzbine(contextPath);
	}
	
	public void snimiPorudzbine() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, porudzbineMap);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(context + "/porudzbineB.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista porudzbine." + porudzbineMap.size());
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
	
	public void dodajNovuPorudzbinu(Porudzbina porudzbina) throws IOException {

		Integer maxId = -1;
		for (String id : porudzbineMap.keySet()) {
			int idNum =Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		porudzbina.setId(maxId.toString());
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		Date date = new Date();
		porudzbina.setDatum_i_vreme_porudzbine(dateFormat.format(date));
		porudzbina.setStatus_porudzbine("Poruceno");
		porudzbineMap.put(porudzbina.getId(), porudzbina);
		snimiPorudzbine();
	}
	
	private void loadPorudzbine(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 porudzbineMap = mapper.readValue(new File(context + "/porudzbineB.txt"), new TypeReference<HashMap<String, Porudzbina>>() {});
			 System.out.println("broj porudzbine je try " + porudzbineMap.size()+".");
			} catch (IOException e) {
				porudzbineMap = new HashMap<String,Porudzbina>();
				System.out.println("broj porudzbine je catch" + porudzbineMap.size()+".");
			}
		System.out.println("broj porudzbine je " + porudzbineMap.size()+".");

	}
	
	public Collection<Porudzbina> deletePorudzbina(String porudzbina) throws IOException {
		for(Porudzbina item : porudzbineMap.values()){
			if(item.getId().equals(porudzbina)){
				item.setIsDeleted(true);
				snimiPorudzbine();
				break;
			}
		}
		
		return porudzbineMap.values();
	}
	
	public Collection<Porudzbina> removeStavku(String idPorudzbine, Artikli artikal) throws IOException {
		for(Porudzbina item : porudzbineMap.values()){
			if(item.getId().equals(idPorudzbine)){
				for(int j=0; j<item.getStavke().size(); j++){
					if(item.getStavke().get(j).getId().equals(artikal.getId())){
						item.getStavke().remove(j);
					}
				}
				snimiPorudzbine();
				break;
			}
		}
		
		return porudzbineMap.values();
	}
	
	public void dodajArtikalUListu(String pid, Artikli a) throws IOException {
		Porudzbina r = findPorudzbina(pid);
		List<Artikli> lr=new ArrayList<Artikli>();

		for(int j=0; j<r.getStavke().size(); j++){
			lr.add(r.getStavke().get(j));
		}
		lr.add(a);
		
		r.getStavke().clear();
		for(int i=0; i<lr.size(); i++){
			r.getStavke().add(lr.get(i));
		}
		
		snimiPorudzbine();
	}
	
	public Collection<Porudzbina> izmenaPorudzbine(String idPorudzbine, Porudzbina porudzbina) throws IOException {
		Porudzbina r = findPorudzbina(idPorudzbine);
		r.setKupac(porudzbina.getKupac());
		r.setDostavljac(porudzbina.getDostavljac());
		r.setNapomena(porudzbina.getNapomena());
		r.setStatus_porudzbine(porudzbina.getStatus_porudzbine());
		
		snimiPorudzbine();
		
		return porudzbineMap.values();
	}
	
	public Collection<Porudzbina> izmeniStatus(String username, String idPorudzbine) throws IOException {
		Porudzbina r = findPorudzbina(idPorudzbine);
		r.setDostavljac(username);
		r.setStatus_porudzbine("Dostava u toku");
		
		snimiPorudzbine();
		
		return porudzbineMap.values();
	}
	
	public void zavrsiStatus(String idPorudzbine) throws IOException {
		Porudzbina r = findPorudzbina(idPorudzbine);
		r.setStatus_porudzbine("Dostavljeno");
		
		snimiPorudzbine();
	}
	
	public void izmeniStatusP(String idPorudzbine) throws IOException {
		Porudzbina r = findPorudzbina(idPorudzbine);
		r.setStatus_porudzbine("Poruceno");
		r.setDostavljac("");
		
		snimiPorudzbine();
	}
}
