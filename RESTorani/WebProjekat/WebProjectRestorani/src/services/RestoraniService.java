package services;


import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Restoran;
import dao.restoranDAO;

@Path("/restorani")
public class RestoraniService {
	
	@Context 
	ServletContext ctx;
	
	public RestoraniService(){
	}
	
	@PostConstruct	
	public void init() {
		if (ctx.getAttribute("restoranDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("restoranDAO", new restoranDAO(contextPath));
		}
	}
	
	@PUT
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> dodajRestoran(Restoran restoran) throws IOException{
		restoranDAO dao=(restoranDAO) ctx.getAttribute("restoranDAO");
		return dao.dodajNoviRestoran(restoran);
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> getRestorane() {
		restoranDAO dao = (restoranDAO) ctx.getAttribute("restoranDAO");
		return dao.findAllRestorane();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Restoran getOneRestoran(@PathParam("id") String id) throws IOException { 
		restoranDAO dao = (restoranDAO) ctx.getAttribute("restoranDAO");
		System.out.println("ID: " + id);
		return dao.findRestoran(id);
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> deleteRestoran(@PathParam("id") String id) throws IOException { 
		restoranDAO dao = (restoranDAO) ctx.getAttribute("restoranDAO");
		System.out.println("ID: " + id);
		return dao.deleteRestoran(id);
	}
	
	@PUT
	@Path("/izmeni")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> editRestoran(Restoran restoran) throws IOException{
		restoranDAO dao = (restoranDAO) ctx.getAttribute("restoranDAO");
		return dao.editRestoran(restoran);
	}
}
