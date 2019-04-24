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

import beans.Artikli;
import beans.Porudzbina;
import dao.porudzbinaDAO;


@Path("/porudzbinee")
public class PorudzbineService {
	
		@Context 
		ServletContext ctx;
		
		public PorudzbineService(){
		}
		
		@PostConstruct	
		public void init() {
			if (ctx.getAttribute("porudzbinaDAO") == null) {
		    	String contextPath = ctx.getRealPath("");
				ctx.setAttribute("porudzbinaDAO", new porudzbinaDAO(contextPath));
			}
		}
		
		@PUT
		@Path("/")
		@Produces(MediaType.APPLICATION_JSON)
		public void dodajPorudzbinu(Porudzbina porudzbina) throws IOException{
			porudzbinaDAO dao=(porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			dao.dodajNovuPorudzbinu(porudzbina);
		}
		
		@GET
		@Path("/")
		@Produces(MediaType.APPLICATION_JSON)
		public Collection<Porudzbina> getPorudzbine() {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			return dao.findAllPorudzbine();
		}
	
		@POST
		@Path("/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public Collection<Porudzbina> izbaciStvkuIzPorudzbine(@PathParam("id") String id, Artikli artikal) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			return dao.removeStavku(id, artikal);
		}
		
		@POST
		@Path("/promenaStatusa/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public void promenaStatusaStvkeIzPorudzbine(@PathParam("id") String id) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			dao.izmeniStatusP(id);
		}
		
		@POST
		@Path("/{username}/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public Collection<Porudzbina> izmeniStatusPorudzbine(@PathParam("username") String username, @PathParam("id") String id) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			return dao.izmeniStatus(username, id);
		}
		
		@POST
		@Path("/add/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public void dodajArtikalUPorudzbine(@PathParam("id") String id, Artikli a) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			dao.dodajArtikalUListu(id, a);
		}
		
		@POST
		@Path("/zavrsiPorudzbinu/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public void zavrsiStatusPorudzbine(@PathParam("id") String id) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			dao.zavrsiStatus(id);
		}
		
		@PUT
		@Path("/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public Collection<Porudzbina> izmeniPorudzbinu(@PathParam("id") String id, Porudzbina porudzbina) throws IOException {
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			return dao.izmenaPorudzbine(id, porudzbina);
		}
		
		@DELETE
		@Path("/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public Collection<Porudzbina> deletePorudzbinu(@PathParam("id") String id) throws IOException { 
			porudzbinaDAO dao = (porudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
			System.out.println("ID: " + id);
			return dao.deletePorudzbina(id);
		}
}
