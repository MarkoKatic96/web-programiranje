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

import beans.Artikli;
import dao.artikalDAO;


@Path("/artikli")
public class ArtikliService {

	@Context 
	ServletContext ctx;
	
	public ArtikliService(){
	}
	
	@PostConstruct	
	public void init() {
		if (ctx.getAttribute("artikalDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("artikalDAO", new artikalDAO(contextPath));
		}
	}
	
	@PUT
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> snimiArtiklee(@PathParam("id") String id, Artikli artikal) throws IOException { 
		artikalDAO dao = (artikalDAO) ctx.getAttribute("artikalDAO");
		System.out.println("ID: " + id);
		return dao.dodajNoviArtikal(id, artikal);
	}
	
	@PUT
	@Path("/a/{id}/{bp}")
	public void kolicinaArtikala(@PathParam("id") String id, @PathParam("bp") String bp) throws IOException { 
		artikalDAO dao = (artikalDAO) ctx.getAttribute("artikalDAO");
		System.out.println("ID: " + id+" bp:" +bp);
		dao.kolicinaArtikal(id, bp);
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> getArtikle() {
		artikalDAO dao = (artikalDAO) ctx.getAttribute("artikalDAO");
		return dao.findAllArtikle();
	}
	
	@PUT
	@Path("/izmeni")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> editArtikle(Artikli artikal) throws IOException{
		artikalDAO dao = (artikalDAO) ctx.getAttribute("artikalDAO");
		return dao.editArtikal(artikal);
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> deleteArtikal(@PathParam("id") String id) throws IOException { 
		artikalDAO dao = (artikalDAO) ctx.getAttribute("artikalDAO");
		return dao.deleteArtikal(id);
	}
}
