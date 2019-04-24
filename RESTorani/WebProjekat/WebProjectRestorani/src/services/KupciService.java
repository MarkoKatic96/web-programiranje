package services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Artikli;
import beans.Kupac;
import beans.Restoran;
import dao.kupacDAO;



@Path("/kupci")
public class KupciService {
	
	@Context 
	ServletContext ctx;
	
	public KupciService(){
	}
	
	@PostConstruct
	
	public void init() {
		if (ctx.getAttribute("kupacDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("kupacDAO", new kupacDAO(contextPath));
		}
	}
	
	@PUT //registracija
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void saveKupce(Kupac kupac) throws IOException{
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		dao.dodajNovogKupca(kupac);
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Kupac login(Kupac kupac, @Context HttpServletRequest request) {
		kupacDAO kupacDao = (kupacDAO) ctx.getAttribute("kupacDAO");
		Kupac loggedUser = kupacDao.find(kupac.getKorisnicko_ime(), kupac.getLozinka());
		if (loggedUser == null) {
			return null;
		}
		request.getSession().setAttribute("kupac", loggedUser);
		return loggedUser;
	}
	
	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Kupac> logout(@Context HttpServletRequest request) {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		request.getSession().invalidate();	
		return dao.findAll();
	}
	
	@POST
	@Path("/dodajOmiljeniRestoran")
	@Produces(MediaType.APPLICATION_JSON)
	public void dodajRestoran(@Context HttpServletRequest request, Restoran restoran) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
        dao.dodajUListuOmiljenih(kupac, restoran);
	}
	
	@POST
	@Path("/dodajStavku")
	@Produces(MediaType.APPLICATION_JSON)
	public void dodajStavkuUKorpu(@Context HttpServletRequest request, Artikli artikal) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
        dao.dodajUListuStavki(kupac, artikal);
	}
	
	@POST
	@Path("/izbaciStavku")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> izbaciStavkuIzKorpe(@Context HttpServletRequest request, Artikli artikal) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
        return dao.izbaciIzListeStavki(kupac, artikal);
	}
	
	@POST
	@Path("/isprazniKorpu")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikli> izbaciSveIzKorpe(@Context HttpServletRequest request, Artikli artikal) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
        return dao.izbaciSveStavke(kupac, artikal);
	}
	
	@POST
	@Path("/bodovi/{id}")
	public void dodajNagradniBod(@PathParam("id") String id) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
        dao.dodajBod(id);
	}
	
	@POST
	@Path("/k/{id}/{b}")
	public int oduzmiNagradniBod(@PathParam("id") String id, @PathParam("b") String b) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
        return dao.oduzmiBod(id, b);
	}
	
	@POST
	@Path("/izbaciOmiljeniRestoran")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> izbaciRestoran(@Context HttpServletRequest request, Restoran restoran) throws IOException {
		kupacDAO dao=(kupacDAO) ctx.getAttribute("kupacDAO");
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
        return dao.izbaciIzListeOmiljenih(kupac, restoran);
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Kupac> getKupce() {
		kupacDAO dao = (kupacDAO) ctx.getAttribute("kupacDAO");
		return dao.findAll();
	}
	
	@GET
	@Path("/ulogovanKorisnik")
	@Produces(MediaType.APPLICATION_JSON)
	public Kupac dajMiUlogovanog(@Context HttpServletRequest request){
		HttpSession sesija = request.getSession();
		Kupac kupac = (Kupac) sesija.getAttribute("kupac");
		return kupac;
	}
	
	
	@PUT
	@Path("/izmeni")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)//samo string
	public Collection<Kupac> editKupca(Kupac kupac) throws IOException{
		kupacDAO dao = (kupacDAO) ctx.getAttribute("kupacDAO");
		return dao.editKupca(kupac);
	}

}
