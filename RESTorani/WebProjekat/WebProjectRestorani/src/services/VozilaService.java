package services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Vozilo;
import dao.voziloDAO;

@Path("/vozila")
public class VozilaService {
	
	@Context 
	ServletContext ctx;
	
	public VozilaService(){
	}
	
	@PostConstruct
	
	public void init() {
		if (ctx.getAttribute("voziloDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("voziloDAO", new voziloDAO(contextPath));
		}
	}
	
	@PUT
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Vozilo> saveVozila(Vozilo vozilo) throws IOException{
		voziloDAO dao=(voziloDAO) ctx.getAttribute("voziloDAO");
		return dao.dodajNovoVozilo(vozilo);
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Vozilo> getVozila() {
		voziloDAO dao = (voziloDAO) ctx.getAttribute("voziloDAO");
		return dao.findAllVozila();
	}	
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Vozilo> deleteVozilo(@PathParam("id") String id) throws IOException { 
		voziloDAO dao = (voziloDAO) ctx.getAttribute("voziloDAO");
		System.out.println("ID: " + id);
		return dao.deleteVozilo(id);
	}
	
	@POST
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public void zauzmiVozilo(@PathParam("id") String id) throws IOException { 
		voziloDAO dao = (voziloDAO) ctx.getAttribute("voziloDAO");
		dao.zauzmiVoziloD(id);
	}
	
	@POST
	@Path("/v/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public void oslobodiVozilo(@PathParam("id") String id) throws IOException { 
		voziloDAO dao = (voziloDAO) ctx.getAttribute("voziloDAO");
		dao.oslobodiVoziloD(id);
	}
	
	@PUT
	@Path("/izmeni")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Vozilo> editVozilo(Vozilo vozilo) throws IOException{
		voziloDAO dao = (voziloDAO) ctx.getAttribute("voziloDAO");
		return dao.editVozilo(vozilo);
	}
}
