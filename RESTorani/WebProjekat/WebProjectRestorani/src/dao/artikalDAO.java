package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikli;


public class artikalDAO {
	private HashMap<String, Artikli> artikliMap = new HashMap<String, Artikli>();
	private String context;
	
	public artikalDAO(){
		
	}
	
	public artikalDAO(String contextPath){
		this.context=contextPath;
		loadArtikle(contextPath);
	}
	
	public Collection<Artikli> findAllArtikle(){
		return artikliMap.values();
	}
	
	public Artikli findArtikal(String id) {
		return artikliMap.containsKey(id) ? artikliMap.get(id) : null;
	}
	
	public void snimiArtikle() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, artikliMap);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(context + "/artikli.txt"); 
	        System.out.println("EO ME2");
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista artiakala." + artikliMap.size());
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
	
	public Collection<Artikli> dodajNoviArtikal(String restoranId, Artikli artikal) throws IOException {
		artikal.setIdRestorana(restoranId);
		Integer maxId = -1;
		for (String id : artikliMap.keySet()) {
			int idNum =Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		artikal.setId(maxId.toString());

		artikliMap.put(artikal.getId(), artikal);
		System.out.println("EO ME1");
		snimiArtikle();
		
		return artikliMap.values();
	}
	
	private void loadArtikle(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 artikliMap = mapper.readValue(new File(contextPath + "/artikli.txt"), new TypeReference<HashMap<String, Artikli>>() {});
			} catch (IOException e) {
				artikliMap = new HashMap<String,Artikli>();
			}
		System.out.println("broj artikala je " + artikliMap.size()+".");

	}
	
	
	public Collection<Artikli> editArtikal(Artikli artikal) throws IOException {
		Artikli r = findArtikal(artikal.getId());
		r.setNaziv(artikal.getNaziv());
		r.setCena(artikal.getCena());
		r.setTip(artikal.getTip());
		r.setOpis(artikal.getOpis());
		r.setKolicina(artikal.getKolicina());
		r.setIdRestorana(artikal.getIdRestorana());
		
		snimiArtikle();
		
		
		return artikliMap.values();
	}
	
	public Collection<Artikli> deleteArtikal(String artikal) throws IOException {
		//trazimo vozilo
		for(Artikli item : artikliMap.values()){
			if(item.getId().equals(artikal)){
				item.setIsDeleted(true);
				snimiArtikle();
				break;
			}
		}
		
		return artikliMap.values();
	}
	
	public void kolicinaArtikal(String id, String bp) throws IOException {
		for(Artikli item : artikliMap.values()){
			if(item.getId().equals(id)){
				int a=item.getBrojProdanih()+Integer.parseInt(bp);
				item.setBrojProdanih(a);
				snimiArtikle();
				break;
			}
		}
	}
	
}
