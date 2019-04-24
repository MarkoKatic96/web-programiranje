function cancelInput(forma){
	document.getElementById(forma).reset();
}

function funkcija1(porudzbina){
	$("#izaberiVozilo").show();
	$("#izaberiVoziloForm").submit(function(event){
		event.preventDefault();
		var e = document.getElementById("izaberiVoziloZaDostavu");
		var voziloId = e.options[e.selectedIndex].value;
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				$.post({
					url: 'rest/vozila/'+ voziloId,
					success: function(){	
						$.post({
							url: 'rest/porudzbinee/'+ kupac.korisnicko_ime +'/'+ porudzbina.id,
							success: function(porudzbine){				
								$("#tabelaPorudzbinaD tbody tr").remove();
								var i;
								for(i=0; i<porudzbine.length; i++){
									if(porudzbine[i].isDeleted!=true && porudzbine[i].status_porudzbine=="Poruceno"){
										addPorudzbinuDTr(porudzbine[i]);										
									}
								}
							$("#izaberiVozilo").hide();	
							}
						});
					}
				});
			}
		});
	});
}

function tabeleNajpopularnijih(){
	$.get({
		url: "rest/artikli",
		success: function(artikli){
			var i,j;
			var listaA=[];
			var listaR=[];
			$.get({
				url: "rest/restorani",
				success: function(restorani){
					$("#tabelaJela tbody tr").remove();
					$("#tabelaPica tbody tr").remove();
					for(i=0; i<artikli.length; i++){
						if(artikli[i].isDeleted!=true){
							for(j=0; j<restorani.length; j++){
								if(artikli[i].idRestorana==restorani[j].id && restorani[j].isDeleted!=true){
									listaA.push(artikli[i]);
								}
							}
						}
					}
					var d;
					for(d=0; d<restorani.length; d++){
						if(restorani[d].isDeleted!=true){
							listaR.push(restorani[d]);
						}
					}
					var c, k;
					for(c=0; c<listaA.length; c++){
						for(k=0; k<(listaA.length-c-1); k++){
							if(listaA[k].brojProdanih<listaA[k+1].brojProdanih){
								var tmp=listaA[k];
								listaA[k]=listaA[k+1];
								listaA[k+1]=tmp;
							}
						}
					}
					var x;
					var brJ=0;
					var rJ="";
					var rP="";
					var brP=0;
					for(x=0; x<listaA.length; x++){
						if(listaA[x].tip=="jelo" && brJ<10){
							var y=0;
							for(y=0; listaR.length; y++){
								if(listaA[x].idRestorana==listaR[y].id){
									rJ=listaR[y].naziv;
									break;
								}
							}
							addNJ(listaA[x], rJ);
							brJ++;
						}else if(listaA[x].tip=="pice" && brP<10){
							var y=0;
							for(y=0; listaR.length; y++){
								if(listaA[x].idRestorana==listaR[y].id){
									rP=listaR[y].naziv;
									break;
								}
							}
							addNP(listaA[x], rP);
							brP++;
						}
					}
				}
			});
		}
	});
}

function kategorijeRestoranaIzlistaj(kategorija){
	$('div.divParent').hide();
	$('div#tabelaArtikalaDiv').hide();
	$('div#tabelaKorisnikaDiv').hide();
	$('div#tabelaVozilaDiv').hide();
	$('div#izlistajPorudzbineAdminDiv').hide();
	$('div#tabelaRestoranaDiv').show();
	$.get({
		url: 'rest/restorani',
		success: function(restorani){				
			var i;
			$("#tabelaRestorana tbody tr").remove();
			for(i=0; i<restorani.length; i++){
				if(restorani[i].kategorija==kategorija && restorani[i].isDeleted!=true){
					addRestoranTr(restorani[i]);
				}
			}
		}
	});	
}

function clickClosure(restoran){
	return function() {
		$('tr.selected').removeClass('selected');
		$(this).addClass('selected');
		$('#izmeniRestoranForm input[name=idRestaurant]').val(restoran.id);
		$('#izmeniRestoranForm input[name=nameRestaurant]').val(restoran.naziv);
		$('#categoryRestaurantIzmena').val(restoran.kategorija).change();
		var myString = restoran.adresa;
		var arr = myString.split('/');
		var arrr=arr[1].split(' ');
		$('#izmeniRestoranForm input[name=cityRestaurant]').val(arr[0]);
		$('#izmeniRestoranForm input[name=streetRestaurant]').val(arrr[0]);
		$('#izmeniRestoranForm input[name=numberRestaurant]').val(arrr[1]);		
		$("#izmeniRestoranBackGroundDiv").show();
	};
}

function clickClosureObrisiVozilo(vozilo){
	return function() {
		if(vozilo.vozilo_trenutno_u_upotrebi==false){
			$.ajax({
				url: "rest/vozila/"+vozilo.id,
				type: "DELETE",
				success: function(vozila){	
					$("#tabelaVozila tbody tr").remove();
					addVoziloTr(vozila);				
				}
			});
		}else{
			alert("Izabrano vozilo je trenutno u upotrebi i ne može se trenutno obrisati. Pokušajte ponovo kada se vozilo oslobodi.");
		}
	};
}


function clickClosureVozila(vozilo){
	return function() {
		if(vozilo.vozilo_trenutno_u_upotrebi==false){
			$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			$('#izmeniVoziloForm input[name=carId]').val(vozilo.id);
			$('#izmeniVoziloForm input[name=carMark]').val(vozilo.marka);
			$('#izmeniVoziloForm input[name=carModel]').val(vozilo.model);
			$('#carTypeIzmena').val(vozilo.tip).change();
			$('#izmeniVoziloForm input[name=carRegisterId]').val(vozilo.registarska_oznaka);
			$('#izmeniVoziloForm input[name=carYear]').val(vozilo.godina_proizvodnje);
			$('#izmeniVoziloForm input[name=carNote]').val(vozilo.napomena);
			$("#carUserI").empty();
			$.get({
				url: 'rest/kupci',
				success: function(dostavljaci){				
					var i;
					for(i=0; i<dostavljaci.length; i++){
						if(dostavljaci[i].uloga=="dostavljac"){
							$("#carUserI").append('<option value='+dostavljaci[i].korisnicko_ime+'>'+dostavljaci[i].korisnicko_ime+'</option>');	
						}					
					}
					$('#carUserI').val(vozilo.korisnikVozila).change();
				}
			});
			$("#izmeniVoziloBackGroundDiv").show();
		}else{
			alert("Izabrano vozilo je trenutno u upotrebi i ne može se trenutno izmeniti. Pokušajte ponovo kada se vozilo oslobodi.");
		}
	};
}


function clickClosureIzmeniPorudzbinu(porudzbina){
	return function() {
		$('#porudzbinaFormIzmena input[name=nameIdP]').val(porudzbina.id);	
		$('#porudzbinaFormIzmena input[name=nameKupacP]').val(porudzbina.kupac);	
		$('#statusPorudzbinaIzmena').val(porudzbina.status_porudzbine).change();	
		$('#porudzbinaFormIzmena input[name=nameDostavljacP]').val(porudzbina.dostavljac);
		$('#porudzbinaFormIzmena input[name=nameNapomenaP]').val(porudzbina.napomena);	
		$("#izmenaPorudzbinaBackGroundDiv").show();
	};
}


function clickClosureKupac(kupac){
	return function() {
		$('tr.selected').removeClass('selected');
		$(this).addClass('selected');
		$('#izmeniKupcaForm input[name=usernameKupac]').val(kupac.korisnicko_ime);
		$('#izmeniKupcaForm input[name=lozinkaKupac]').val(kupac.lozinka);
		$('#izmeniKupcaForm input[name=imeKupac]').val(kupac.ime);
		$('#izmeniKupcaForm input[name=prezimeKupac]').val(kupac.prezime);
		$('#izmeniKupcaForm input[name=telefonKupac]').val(kupac.kontakt_telefon);
		$('#izmeniKupcaForm input[name=emailKupac]').val(kupac.email);
		$('#izmeniKupcaForm input[name=datumKupac]').val(kupac.datum_registracije);
		$('#userRoleIzmena').val(kupac.uloga).change();
		$("#izmeniKupcaBackGroundDiv").show();
	};
}

function clickClosureArtikli(artikal){
	return function() {
		$("#selectRestoranZaArtikalIzmena").empty();
		$.get({
			url: "rest/restorani",
			success: function(restorani){
				var i;
				for(i=0; i<restorani.length; i++){
					if(restorani[i].isDeleted!=true){
						$("#selectRestoranZaArtikalIzmena").append('<option value='+restorani[i].id+'>'+restorani[i].naziv+" "+restorani[i].adresa+'</option>');
					}
				}
				$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				$('#artikalFormIzmena input[name=idArtikla]').val(artikal.id);
				$('#artikalFormIzmena input[name=idRestoranaZaArtikle]').val(artikal.idRestorana);
				$('#artikalFormIzmena input[name=nameArtikal]').val(artikal.naziv);
				$('#artikalFormIzmena input[name=priceArtikal]').val(artikal.cena);
				var kol=artikal.kolicina;
				var arr=kol.split(' ');
				$('#artikalFormIzmena input[name=amountArtikal]').val(arr[0]);
				$('#artikalFormIzmena input[name=descriptionArtikal]').val(artikal.opis);
				$('#tipArtiklaIzmena').val(artikal.tip).change();
				$('#selectRestoranZaArtikalIzmena').val(artikal.idRestorana).change();
				$("#izmenaArtikalBackGroundDiv").show();
			}
		});
	};
}

function addArtikalTr(artikal){
	var tdRestoran="";
	$.get({
		url: "rest/restorani",
		success: function(restorani){
			var i;
			for(i=0; i<restorani.length; i++){
				if(artikal.idRestorana==restorani[i].id){
					tdRestoran=$('<td>'+restorani[i].naziv+'</td>');
				}
			}
			let trA=$('<tr></tr>');
			let tdTip=$('<td>'+artikal.tip+'</td>');
			let tdNaziv=$('<td>'+artikal.naziv+'</td>');
			let tdCena=$('<td>'+artikal.cena+'</td>');	
			let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
			let tdOpis=$('<td>'+artikal.opis+'</td>');
			if($('#a3').is(":visible")){
				let tdObrisiA=$('<td>'+'<a id="izbrisiArtikal" style="color:white;" href="rest/artikli/'+artikal.id +'">'+'Obrisi</a>'+'</td>');
				let tdIzmeniA=$('<td><u> Izmeni </u></td>');
				let tdDodajA=$('<td><u> Dodaj </u></td>');
				trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdOpis).append(tdRestoran).append(tdIzmeniA).append(tdObrisiA).append(tdDodajA);
				tdIzmeniA.click(clickClosureArtikli(artikal));
				tdDodajA.click(clickClosureAddajArtikal(artikal));
			}else if($("#a5").is(":visible")){
				let tdDodaj=$('<td class="izmeniButtonClass"><u>Dodaj</u></td>');
				trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdOpis).append(tdRestoran).append(tdDodaj);
				tdDodaj.click(clickClosureDodajUKorpu(artikal));
			}else{	
				trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdOpis).append(tdRestoran);
			}
			if(artikal.tip=="jelo"){
				$('#tabelaArtikala tbody').append(trA);
			}else{
				$('#tabelaArtikalaP tbody').append(trA);
			}
		}
	});
}

function addStavkuTr(artikal){
	let trA=$('<tr></tr>');
	let tdTip=$('<td>'+artikal.tip+'</td>');
	let tdNaziv=$('<td>'+artikal.naziv+'</td>');
	let tdCena=$('<td>'+artikal.cena+'</td>');	
	let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
	let tdBroj=$('<td>'+artikal.broj_u_por+'</td>');
	let tdIzbaci=$('<td><u> Izbaci </u></td>');
	trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdBroj).append(tdIzbaci);
	tdIzbaci.click(clickClosureIzbaciStavku(artikal));
	$('#tabelaTrenutneKorpe tbody').append(trA);	
}

function clickUdjiURestoran(restoran){
	return function(){
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$('div#mojaStranicaDiv').hide();
		$('#captionRestorana').text('Artikli');
		$("#tabelaArtikalaDiv").show();
		$.get({
			url: 'rest/artikli',
			success: function(artikli){				
				var i;
				$("#tabelaArtikala tbody tr").remove();
				$("#tabelaArtikalaP tbody tr").remove();
				for(i=0; i<artikli.length; i++){
					if(artikli[i].idRestorana==restoran.id){
						if(artikli[i].isDeleted!=true){
							addArtikalTr(artikli[i]);
						}
					}					
				}
			}
		});	
		/*$('button#dodajArtikalButton').click(function(event){
			$('#artikalForm input[name=idRestoranaZaArtikle]').val(restoran.id);
			$('div#artikalBackGroundDiv').show();
			event.preventDefault();	
		});*/
	}
}

function clickUdjiUPorudzbinu(porudzbina){
	return function(){
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('#captionRestorana').text('Artikli porudžbine');
		$("#artikliPorudzbineDiv").show();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){				
				var i, g;
				$("#tabelaArtikliPorudzbine tbody tr").remove();
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].id==porudzbina.id){
						for(g=0; porudzbine[i].stavke.length; g++){
							addArtikalPorudzbinaTr(porudzbine[i], porudzbine[i].stavke[g]);
						}
					}					
				}
			}
		});	
	}
}

function clickUdjiUPorudzbinuD(porudzbina){
	return function(){
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$("#artikliPorudzbineDDiv").show();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){				
				var i, g;
				$("#tabelaArtikliPorudzbineD tbody tr").remove();
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].id==porudzbina.id){
						for(g=0; porudzbine[i].stavke.length; g++){
							addArtikalPorudzbinaDTr(porudzbine[i], porudzbine[i].stavke[g]);
						}
					}					
				}
			}
		});	
	}
}

function clickClosureAddajArtikal(artikal){
	return function(){
		$('#porudzbinaFormAdd input[name=idArtiklaKSD]').val(artikal.id);
		var sel=document.getElementById("selectPorudzbinuUKSD");
		$("#selectPorudzbinuUKSD").empty();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){
				var s;
				for(s=0; s<porudzbine.length; s++){
					var opt=document.createElement("option");
					opt.value=porudzbine[s].id;
					opt.text=porudzbine[s].kupac+" "+porudzbine[s].datum_i_vreme_porudzbine;
					sel.appendChild(opt);
				}
				$("#dodajArtikalSelectBackGroundDiv").show();
			}
		});	
	}
}

function addArtikalPrethodnaPorudzbinaTr(porudzbina, artikal){	
			let trA=$('<tr></tr>');
			let tdTip=$('<td>'+artikal.tip+'</td>');
			let tdNaziv=$('<td>'+artikal.naziv+'</td>');
			let tdCena=$('<td>'+artikal.cena+'</td>');	
			let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
			let tdBroj=$('<td>'+artikal.broj_u_por+'</td>');
			trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdBroj);
			$('#tabelaArtikalaPrethodnihPorudzbina tbody').append(trA);	
}

function addArtikleDTr(artikal){
	let trA=$('<tr></tr>');
	let tdTip=$('<td>'+artikal.tip+'</td>');
	let tdNaziv=$('<td>'+artikal.naziv+'</td>');
	let tdCena=$('<td>'+artikal.cena+'</td>');	
	let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
	let tdBroj=$('<td>'+artikal.broj_u_por+'</td>');
	trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdBroj);
	$('#tabelaTrenutnePorudzbine tbody').append(trA);	
}

function clickClosureArtikliPrethodnihPorudzbina(porudzbina){
	return function(){
		$('div#mojaStranicaDiv').hide();
		$('#captionRestorana').text('Artikli porudžbine');
		$("#tabelaArtikalaPrethodnihPorudzbinaDiv").show();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){				
				var i, g;
				$("#tabelaArtikalaPrethodnihPorudzbina tbody tr").remove();
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].id==porudzbina.id){
						for(g=0; porudzbine[i].stavke.length; g++){
							addArtikalPrethodnaPorudzbinaTr(porudzbine[i], porudzbine[i].stavke[g]);
						}
					}					
				}
			}
		});	
	}
}

function addArtikalPorudzbinaTr(porudzbina, artikal){
	console.log(porudzbina.kupac+" "+artikal.naziv);
	let trA=$('<tr></tr>');
	let tdTip=$('<td>'+artikal.tip+'</td>');
	let tdNaziv=$('<td>'+artikal.naziv+'</td>');
	let tdCena=$('<td>'+artikal.cena+'</td>');	
	let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
	var sel=document.createElement("select");
	let tdBroj=$('<td>'+artikal.broj_u_por+'</td>');
	let tdIzbaci=$('<td><u> Izbaci </u></td>');
	trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdBroj).append(tdIzbaci);
	tdIzbaci.click(clickClosureIzbaciStavkuAdmin(porudzbina, artikal));
	$('#tabelaArtikliPorudzbine tbody').append(trA);	
}

function addArtikalPorudzbinaDTr(porudzbina, artikal){
	console.log(porudzbina.kupac+" "+artikal.naziv);
	let trA=$('<tr></tr>');
	let tdTip=$('<td>'+artikal.tip+'</td>');
	let tdNaziv=$('<td>'+artikal.naziv+'</td>');
	let tdCena=$('<td>'+artikal.cena+'</td>');	
	let tdKolicina=$('<td>'+artikal.kolicina+'</td>');
	let tdBroj=$('<td>'+artikal.broj_u_por+'</td>');
	trA.append(tdTip).append(tdNaziv).append(tdCena).append(tdKolicina).append(tdBroj);
	$('#tabelaArtikliPorudzbineD tbody').append(trA);	
}

function clickClosureIzbaciStavkuAdmin(porudzbina, artikal){
	return function(){				
		$.post({
			url: 'rest/porudzbinee/'+porudzbina.id,
			data: JSON.stringify({id: artikal.id}),
			contentType: 'application/json',
			success:function() {						
				$.get({
					url: 'rest/porudzbinee',
					success: function(porudzbine){				
						var i, g;
						$("#artikliPorudzbineDiv tbody tr").remove();
						for(i=0; i<porudzbine.length; i++){
							if(porudzbine[i].id==porudzbina.id){
								for(g=0; porudzbine[i].stavke.length; g++){
									addArtikalPorudzbinaTr(porudzbine[i], porudzbine[i].stavke[g]);
								}
							}					
						}
					}
				});
			}
		});
	}
}

function clickClosurePreuzmiPorudzbinu(porudzbina){
	return function(){	
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				$.get({
					url: 'rest/porudzbinee',
					success: function(porudzbine){
						var j;
						var nasao=0;
						for(j=0; j<porudzbine.length; j++){
							if(porudzbine[j].isDeleted!=true && porudzbine[j].status_porudzbine=="Dostava u toku"
								&& porudzbine[j].dostavljac==kupac.korisnicko_ime){
								alert("Već imate dostavu u toku, završite je kako bi ste preuzeli novu.")
								nasao=1;
								break;
							}
						}
						if(nasao==0){
							$.get({
								url: 'rest/vozila',
								success: function(vozila){
									$('#izaberiVoziloZaDostavu').empty();
									var b;
									for(b=0; b<vozila.length; b++){
										if(vozila[b].isDeleted!=true && vozila[b].korisnikVozila==kupac.korisnicko_ime){
											$('#izaberiVoziloZaDostavu').append( '<option value="'+vozila[b].id+'">'+vozila[b].marka+" "+vozila[b].model+'</option>' );
										}
									}	
									if($('#izaberiVoziloZaDostavu').has('option').length == 0) {
										alert("Admin vam nije dodelio nijedno vozilo. Ne možete da preuzmete porudžbinu.");
									}else{
										funkcija1(porudzbina);
									}
								}
							});
							/*$.post({
								url: 'rest/porudzbinee/'+ kupac.korisnicko_ime +'/'+ porudzbina.id,
								success: function(porudzbine){				
									$("#tabelaPorudzbinaD tbody tr").remove();
									var i;
									for(i=0; i<porudzbine.length; i++){
										if(porudzbine[i].isDeleted!=true && porudzbine[i].status_porudzbine=="Poruceno"){
											addPorudzbinuDTr(porudzbine[i]);										
										}
									}
								}
							});*/
						}
					}
				});
			}
		});
	}
}

function clickClosureDodaj(restoran){
	return function(){
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){	
				$.post({
					url: 'rest/kupci/dodajOmiljeniRestoran',
					data: JSON.stringify({id: restoran.id, naziv:restoran.naziv, adresa:restoran.adresa, kategorija:restoran.kategorija}),
					contentType: 'application/json',
					success:function() {
						$.get({
							url: 'rest/restorani',
							success: function(restorani){
								var d
								$("#tabelaRestorana tbody tr").remove();
								for(d=0; d<restorani.length; d++){
									if(restorani[d].isDeleted!=true){
										addRestoranTr(restorani[d]);
									}
								}
							}
						});
					}
				});
			}
		});
	}
}

function clickClosureDodajUKorpu(artikal){
	return function(){
		$('#porudzbinaFormNumber input[name=idArtiklaKSB]').val(artikal.id);
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				var i;
				var tuJe=0;
				for(i=0; i<kupac.lista_stavki.length; i++){	
					if(kupac.lista_stavki[i].id==artikal.id){
						alert("Izabrani artikal se već nalazi u korpi.");
						tuJe=1;
						break;
					}
				}				
				if(tuJe==0){
					$("#dodajBrojArtikalBackGroundDiv").show();
				}
			}
		});
	}
}

function clickClosureIzbaci(restoran){
	return function(){
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){	
				$.post({
					url: 'rest/kupci/izbaciOmiljeniRestoran',
					data: JSON.stringify({id: restoran.id, naziv:restoran.naziv, adresa:restoran.adresa, kategorija:restoran.kategorija}),
					contentType: 'application/json',
					success:function(restorani) {						
						var d
						$("#tabelaOmiljenihRestorana tbody tr").remove();
						for(d=0; d<restorani.length; d++){
							if(restorani[d].isDeleted!=true){
								console.log("ja proso: "+ restorani[d].naziv)
								addOmiljeniRestoranTr(restorani[d]);
							}
						}				
					}
				});
			}
		});
	}
}

function clickClosureIzbaciStavku(artikal){
	return function(){
		var cena=0;
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){	
				$.post({
					url: 'rest/kupci/izbaciStavku',
					data: JSON.stringify({id: artikal.id, tip:artikal.tip, naziv:artikal.naziv, cena:artikal.cena, kolicina:artikal.kolicina}),
					contentType: 'application/json',
					success:function(artikli) {
						var g;
						$("#tabelaTrenutneKorpe tbody tr").remove();
						for(g=0; g<artikli.length; g++){
							addStavkuTr(artikli[g]);
							cena+=artikli[g].cena*artikli[g].broj_u_por;
						}
						$("#ukupnaCena").text("Ukupna cena: "+cena+" rsd");
					}
				});
			}
		});
	}
}

function clickClosureObrisiPorudzbinu(porudzbina){
	return function(){
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){	
				$.post({
					url: 'rest/kupci/izbaciStavku',
					data: JSON.stringify({id: artikal.id, tip:artikal.tip, naziv:artikal.naziv, cena:artikal.cena, kolicina:artikal.kolicina}),
					contentType: 'application/json',
					success:function(artikli) {
						var g;
						$("#tabelaTrenutneKorpe tbody tr").remove();
						for(g=0; g<artikli.length; g++){
							addStavkuTr(artikli[g]);
						}
					}
				});
			}
		});
	}
}

//skriveno polje da bude id restorana i da se proslede podaci artikla i onda slicno kao delete

function addRestoranTr(restoran) {
	let tr=$('<tr></tr>');
	let tds=$('<td>'+restoran.naziv+'</td>'+'<td>'+restoran.adresa+'</td>'+'<td>'+restoran.kategorija+'</td>');
	if($("#a1").is(":visible")){
		let tdIzmeni=$('<td class="izmeniButtonClass"><u>Izmeni</u></td>');
		let tdObrisi=$('<td>'+'<a id="izbrisiRestoran" style="color:white;" href="rest/restorani/'+restoran.id +'">'+'Obrisi</a>');
		tr.append(tds).append(tdIzmeni).append(tdObrisi);
		tdIzmeni.click(clickClosure(restoran));
	}else if($("#a6").is(":visible")){
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				var j;
				var vecJeTu=0;
				for(j=0; j<kupac.lista_omiljenih_restorana.length; j++){
					if(restoran.id==kupac.lista_omiljenih_restorana[j].id){
						vecJeTu=1;
						break;
					}	
				}
				if(vecJeTu!=1){
					let tdDodaj=$('<td class="izmeniButtonClass"><u>Dodaj</u></td>');
					tr.append(tds).append(tdDodaj);
					tdDodaj.click(clickClosureDodaj(restoran));
				}else{
					let tdIzbaci=$('<td class="izmeniButtonClass"><u>Izbaci</u></td>');
					tr.append(tds).append(tdIzbaci);
					tdIzbaci.click(clickClosureIzbaci(restoran));
				}
			}
		});
	}else{
		tr.append(tds)
	}
	
	tds.click(clickUdjiURestoran(restoran));
	$('#tabelaRestorana tbody').append(tr);
}

function addOmiljeniRestoranTr(restoran){
	let tr=$('<tr></tr>');
	let tdor=$('<td>'+restoran.naziv+'</td>'+'<td>'+restoran.adresa+'</td>'+'<td>'+restoran.kategorija+'</td>');	
	let tdIzbaci=$('<td class="izmeniButtonClass"><u>Izbaci</u></td>');
	tr.append(tdor).append(tdIzbaci);
	tdor.click(clickUdjiURestoran(restoran));
	tdIzbaci.click(clickClosureIzbaci(restoran));
	$('#tabelaOmiljenihRestorana tbody').append(tr);
}

function addPorudzbinaTr(porudzbina){
	var dost="";
	var nap="";
	if(porudzbina.dostavljac==null){
		dost="";
	}else{
		dost=porudzbina.dostavljac;
	}
	if(porudzbina.napomena==null){
		nap="";
	}else{
		nap=porudzbina.napomena;
	}
	let tr=$('<tr></tr>');
	let tdor=$('<td>'+porudzbina.kupac+'</td>'+'<td>'+porudzbina.status_porudzbine+'</td>'+'<td>'+porudzbina.datum_i_vreme_porudzbine+'</td>'+'<td>'+nap+'</td>'+'<td>'+dost+'</td>');	
	let tdIzmeni=$('<td class="izmeniButtonClass"><u>Izmeni</u></td>');
	let tdObrisi=$('<td>'+'<a id="izbrisiPorudzbinu" style="color:white;" href="rest/porudzbinee/'+porudzbina.id +'">'+'Obrisi</a>'+'</td>');
	tr.append(tdor).append(tdIzmeni).append(tdObrisi);
	tdor.click(clickUdjiUPorudzbinu(porudzbina));
	tdIzmeni.click(clickClosureIzmeniPorudzbinu(porudzbina));
	$('#tabelaPorudzbinaAdmin tbody').append(tr);
}

function addPorudzbinuDTr(porudzbina){
	let tr=$('<tr></tr>');
	var por="";
	if(porudzbina.napomena==null){
		por="";
	}else{
		por=porudzbina.napomena;
	}
	let tdor=$('<td>'+porudzbina.kupac+'</td>'+'<td>'+porudzbina.status_porudzbine+'</td>'+'<td>'+porudzbina.datum_i_vreme_porudzbine+'</td>'+'<td>'+por+'</td>');	
	let tdPreuzmi=$('<td class="izmeniButtonClass"><u>Preuzmi</u></td>');
	tr.append(tdor).append(tdPreuzmi);
	tdor.click(clickUdjiUPorudzbinuD(porudzbina));
	tdPreuzmi.click(clickClosurePreuzmiPorudzbinu(porudzbina));
	$('#tabelaPorudzbinaD tbody').append(tr);
}

function addPrethodnePorudzbine(porudzbina){
	var dost="";
	var nap="";
	console.log("EO ME");
	let tr=$('<tr></tr>');
	if(porudzbina.dostavljac==null){
		dost="";
	}else{
		dost=porudzbina.dostavljac;
	}
	if(porudzbina.napomena==null){
		nap="";
	}else{
		nap=porudzbina.napomena;
	}
	let tdpp=$('<td>'+porudzbina.kupac+'</td>'+'<td>'+porudzbina.status_porudzbine+'</td>'+'<td>'+porudzbina.datum_i_vreme_porudzbine+'</td>'+'<td>'+nap+'</td>'+'<td>'+dost+'</td>');	
	tr.append(tdpp);
	tdpp.click(clickClosureArtikliPrethodnihPorudzbina(porudzbina));
	$('#tabelaPrethodnihPorudzbina tbody').append(tr);
}

function addVoziloTr(vozila){
	for(i=0; i<vozila.length; i++){
		if(vozila[i].isDeleted!=true){
			let trV=$('<tr></tr>');
			let tdMarka=$('<td>'+vozila[i].marka+'</td>');
			let tdModel=$('<td>'+vozila[i].model+'</td>');
			let tdTip=$('<td>'+vozila[i].tip+'</td>');
			let tdRO=$('<td>'+vozila[i].registarska_oznaka+'</td>');
			let tdGod=$('<td>'+vozila[i].godina_proizvodnje+'</td>');
			let tdNapomena=$('<td>'+vozila[i].napomena+'</td>');
			let tdUser=$('<td>'+vozila[i].korisnikVozila+'</td>');
			//let tdObrisiV=$('<td>'+'<a id="izbrisiVozilo" style="color:white;" href="rest/vozila/'+vozila[i].id +'">'+'Obrisi</a>'+'</td>');
			let tdIzmeniV=$('<td><u> Izmeni </u></td>');
			let tdObrisiV=$('<td>'+'<u>Obriši</u>'+'</td>');
			trV.append(tdMarka).append(tdModel).append(tdTip).append(tdRO).append(tdGod).append(tdNapomena).append(tdUser).append(tdIzmeniV).append(tdObrisiV);
			tdIzmeniV.click(clickClosureVozila(vozila[i]));
			tdObrisiV.click(clickClosureObrisiVozilo(vozila[i]));
			$('#tabelaVozila tbody').append(trV);	
		}
	}
}

function addKupacTr(kupac){
	let trK=$('<tr></tr>');
	let tdUsername=$('<td>'+kupac.korisnicko_ime+'</td>');
	let tdIme=$('<td>'+kupac.ime+'</td>');
	let tdPrezime=$('<td>'+kupac.prezime+'</td>');
	let tdTelefon=$('<td>'+kupac.kontakt_telefon+'</td>');
	let tdEmail=$('<td>'+kupac.email+'</td>');
	let tdUloga=$('<td>'+kupac.uloga+'</td>');
	let tdIzmeniK=$('<td><u>Izmeni ulogu</u></td>');
	trK.append(tdUsername).append(tdIme).append(tdPrezime).append(tdTelefon).append(tdEmail).append(tdUloga).append(tdIzmeniK);
	trK.click(clickClosureKupac(kupac));
	$('#tabelaKorisnika tbody').append(trK);
}

function addNJ(artikal, nazivR){
	let trA=$('<tr></tr>');
	let nazivA=$('<td>'+artikal.naziv+'</td>');
	let cenaA=$('<td>'+artikal.cena+'</td>');
	let kolicinaA=$('<td>'+artikal.kolicina+'</td>');
	let nazivRes=$('<td>'+nazivR+'</td>');
	trA.append(nazivA).append(cenaA).append(kolicinaA).append(nazivRes);
	$('#tabelaJela tbody').append(trA);
}

function addNP(artikal, nazivR){
	let trA=$('<tr></tr>');
	let nazivA=$('<td>'+artikal.naziv+'</td>');
	let cenaA=$('<td>'+artikal.cena+'</td>');
	let kolicinaA=$('<td>'+artikal.kolicina+'</td>');
	let nazivRes=$('<td>'+nazivR+'</td>');
	trA.append(nazivA).append(cenaA).append(kolicinaA).append(nazivRes);
	$('#tabelaPica tbody').append(trA);
}


$(document).ready(function() {
//PRIJAVA//////////////////////////////////////////////////////////////////////////////
	
	tabeleNajpopularnijih();
	$.get({
		url: 'rest/kupci/ulogovanKorisnik',
		success: function(kupac){
			if(kupac==null){
				$('button#buttonOdjaviSe').hide();
				$('button#buttonKorpa').hide();
				$('button#buttonMojaStranica').hide();
				$('button#buttonVozila').hide();
				$('button#buttonPorudzbine').hide();
				$('button#buttonKorisnici').hide();
				$('button#buttonRestorani').hide();
				$('button#buttonPorudzbineD').hide();
				$('#tabelaRestoranaDiv').hide();
				$('#tabelaVozilaDiv').hide();
				$('#tabelaKorisnikaDiv').hide();
				$('div#artikliPorudzbineDiv').hide();
				$('div#mojaStranicaDiv').hide();
				$('div#mojaKorpaDiv').hide();
				$('div#izlistajPrudzbineAdminDiv').hide();
				$('div#tabelaRestoranaDiv').hide();
				$('#a1').hide();
				$('#a2').hide();
				$('#a3').hide();
				$('#a4').hide();
				$('#a5').hide();
				$('#a6').hide();	
				$('#a7').hide();
				$('#c3').hide();
				$('#c4').hide();
				$('#c5').hide();	
				$('#c7').hide();
				$('div#izlistajPorudzbineDDiv').hide();
				$('div#artikliPorudzbineDDiv').hide();
				//$("#dodajArtikalButton").hide();
				$("div#tabelaArtikalaDiv").hide();
				$('button#buttonRegistrujSe').show();
				$('button#buttonPrijaviSe').show();
				$('div.divParent').show();
			}else{
				if(kupac.uloga=="kupac"){
					$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
					$('button#buttonRegistrujSe').hide();
					$('button#buttonPrijaviSe').hide();
					$('div#izlistajPorudzbineDDiv').hide();
					$('div#artikliPorudzbineDDiv').hide();
					$('button#buttonOdjaviSe').show();
					$('button#buttonKorpa').show();
					$('button#buttonMojaStranica').show();	
					$('#a5').show();
					$('#a6').show();
					$('#c5').show();
					cancelInput("formaLogin");
				}else if(kupac.uloga=="admin"){
					$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
					$('button#buttonRegistrujSe').hide();
					$('button#buttonPrijaviSe').hide();
					$('div#izlistajPorudzbineDDiv').hide();
					$('div#artikliPorudzbineDDiv').hide();
					$('button#buttonOdjaviSe').show();
					$('button#buttonVozila').show();
					$('button#buttonPorudzbine').show();
					$('button#buttonKorisnici').show();
					$('button#buttonRestorani').show();
					//$('button#dodajArtikalButton').show();
					$("button#arikalButtonLi").show();
					$('#a1').show();
					$('#a2').show();
					$('#a3').show();
					$('#a4').show();
					$('#a7').show();
					$('#c3').show();
					$('#c4').show();	
					$('#c7').show();
					cancelInput("formaLogin");
				}else if(kupac.uloga=="dostavljac"){
					$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
					$('button#buttonRegistrujSe').hide();
					$('button#buttonPrijaviSe').hide();
					$('button#buttonOdjaviSe').show();
					$('button#buttonPorudzbineD').show();
					cancelInput("formaLogin");
			}
			}
		}
	});
	
	$('button#buttonPrijaviSe').click(function(event) {
		$('div#loginBackGroundDiv').show();
		event.preventDefault();
	});		
	
	$('button#buttonX').click(function(){
		$('div#loginBackGroundDiv').hide();
		cancelInput("formaLogin");
		return false;
	});
	
	$("#formaLogin").submit(function(event){
		event.preventDefault();
		let username = $('#formaLogin input[name="username"]').val();
		let pass = $('#formaLogin input[name="password1"]').val();
		$.post({
			url: 'rest/kupci/login',
			data: JSON.stringify({korisnicko_ime: username, lozinka: pass}),
			contentType: 'application/json',
			success: function(kupac){
				if(kupac!=null){
						if(kupac.uloga=="kupac"){
							$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
							$('button#buttonRegistrujSe').hide();
							$('button#buttonPrijaviSe').hide();
							$('button#buttonOdjaviSe').show();
							$('button#buttonKorpa').show();
							$('button#buttonMojaStranica').show();	
							$('#a5').show();
							$('#a6').show();
							$('#c5').show();
							$("#divParentId").show();
							cancelInput("formaLogin");
						}else if(kupac.uloga=="admin"){
							$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
							$('button#buttonRegistrujSe').hide();
							$('button#buttonPrijaviSe').hide();
							$('button#buttonOdjaviSe').show();
							$('button#buttonVozila').show();
							$('button#buttonPorudzbine').show();
							$('button#buttonKorisnici').show();
							$('button#buttonRestorani').show();
							$("button#arikalButtonLi").show();
							$('#a1').show();
							$('#a2').show();
							$('#a3').show();
							$('#a4').show();
							$('#a7').show();
							$('#c3').show();
							$('#c4').show();	
							$('#c7').show();
							$("#divParentId").show();
							cancelInput("formaLogin");
						}else if(kupac.uloga=="dostavljac"){
							$('div#loginBackGroundDiv').hide(); //uspesno prijavljivanje	
							$('button#buttonRegistrujSe').hide();
							$('button#buttonPrijaviSe').hide();
							$('button#buttonOdjaviSe').show();
							$('button#buttonPorudzbineD').show();
							$("#divParentId").show();
							cancelInput("formaLogin");
						}				
				}else{
					$('#errorLogin').show().delay(3000).fadeOut();
				}
			}
		});
	});
	
	$('button#buttonOdjaviSe').click(function(event){
		$.post({
			url: 'rest/kupci/logout',
			success: function(kupci){						
				$('button#buttonOdjaviSe').hide();
				$('button#buttonKorpa').hide();
				$('button#buttonMojaStranica').hide();
				$('button#buttonVozila').hide();
				$('button#buttonPorudzbine').hide();
				$('button#buttonKorisnici').hide();
				$('button#buttonRestorani').hide();
				$('button#buttonPorudzbineD').hide();
				$('#tabelaRestoranaDiv').hide();
				$('div#tremutmaPrudzbinaDiv').hide();
				$('#tabelaVozilaDiv').hide();
				$('#tabelaKorisnikaDiv').hide();
				$('div#artikliPorudzbineDiv').hide();
				$('div#mojaStranicaDiv').hide();
				$('div#mojaKorpaDiv').hide();
				$('div#izlistajPrudzbineAdminDiv').hide();
				$('div#tabelaRestoranaDiv').hide();
				$('div#izlistajPorudzbineDDiv').hide();
				$('div#artikliPorudzbineDDiv').hide();
				$('button#arikalButtonLi').hide();
				$('#a1').hide();
				$('#a2').hide();
				$('#a3').hide();
				$('#a4').hide();
				$('#a5').hide();
				$('#a6').hide();	
				$('#a7').hide();
				$('#c3').hide();
				$('#c4').hide();
				$('#c5').hide();	
				$('#c7').hide();
				//$("#dodajArtikalButton").hide();
				$("div#tabelaArtikalaDiv").hide();
				$('button#buttonRegistrujSe').show();
				$('button#buttonPrijaviSe').show();
				$('div.divParent').show();
			}
		});	
		event.preventDefault();
	});
///////////////////////////////////////////////////////////////////////////////////////
//REGISTRACIJA/////////////////////////////////////////////////////////////////////////
	$('button#buttonRegistrujSe').click(function(event) {
		$('div#registerBackGroundDiv').show();
		event.preventDefault();
	});		
	
	$('button#buttonXr').click(function(){
		$('div#registerBackGroundDiv').hide();
		cancelInput("registerForm");
		return false;
	});
	
	$("#registerForm").submit(function(event){
		event.preventDefault();
		let username = $('#registerForm input[name="usernameRegister"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		let password = $('#registerForm input[name="loginRegister"]').val();
		let name = $('#registerForm input[name="nameRegister"]').val();
		let surname = $('#registerForm input[name="surnameRegister"]').val();
		let phone= $('#registerForm input[name="phoneRegister"]').val();
		let email = $('#registerForm input[name="emailRegister"]').val();
		if(username!="" && password!="" && name!="" && surname!="" && phone!="" && email!=""){
			$.get({
				url: 'rest/kupci',
				success: function(kupci){
					var i, j;
					var pronasao=0;
					var pronasaoE=0;
					var telefon=0;
					for(i=0; i<kupci.length; i++){
						if(kupci[i].korisnicko_ime==username){
							$('#errorRegistration').show().delay(3000).fadeOut();
							pronasao=1;
							break;
						}
					}
					for(j=0; j<kupci.length; j++){
						if(kupci[j].email==email){
							$('#errorRegistrationE').show().delay(3000).fadeOut();
							pronasaoE=1;
							break;
						}
					}
					if(isNaN(phone)){
						$('#errorRegistrationP').show().delay(3000).fadeOut();
						telefon=1;
					}
					if(pronasao!=1 && pronasaoE!=1 && telefon!=1){
						$.ajax({
							url: 'rest/kupci', 
							type: "PUT" ,
							data: JSON.stringify({korisnicko_ime: username, lozinka: password, ime: name, prezime: surname,  kontakt_telefon: phone, email: email}),
							contentType: "application/json", //to oznacava ono sto saljemo
							success : function(response) {
								cancelInput("registerForm");
								$('div#registerBackGroundDiv').hide();
							}	
						});
					}
				}
			});
		}else{
			$('#errorRegistration1').show().delay(3000).fadeOut();
		}
	});
///////////////////////////////////////////////////////////////////////////////////////
//FILTER///////////////////////////////////////////////////////////////////////////////
	$('button#buttonFiltriraj').click(function(event) {
		$('div#filterBackGroundDiv').show();
		event.preventDefault();
	});	
	
	$('button#buttonXf').click(function(event) {
		$('div#filterBackGroundDiv').hide();
		cancelInput("formaFilter");
		event.preventDefault();
	});	
	
	$('button#filterRestorani').click(function(event) {
		$('div#filterArtikliDiv').hide();
		$('div#filterRestoraniDiv').show();
		event.preventDefault();
	});	
	
	$('button#filterArtikli').click(function(event) {
		$('div#filterRestoraniDiv').hide();
		$('div#filterArtikliDiv').show();
		event.preventDefault();
	});	
///////////////////////////////////////////////////////////////////////////////////////
//ADMIN////////////////////////////////////////////////////////////////////////////////
	$('button#buttonDodajRestoran').click(function(event){
		$('div#dodajRestoranBackGroundDiv').show();
		event.preventDefault();	
	});

	$('button#buttonDodajVozilo').click(function(event){
		$("#carUser").empty();
		$.get({
			url: 'rest/kupci',
			success: function(dostavljaci){				
				var i;
				for(i=0; i<dostavljaci.length; i++){
					if(dostavljaci[i].uloga=="dostavljac"){
						$("#carUser").append('<option value='+dostavljaci[i].korisnicko_ime+'>'+dostavljaci[i].korisnicko_ime+'</option>');
					}					
				}
			}
		});	
		$('div#dodajVoziloBackGroundDiv').show();
		event.preventDefault();	
	});
	
	$('button#buttonXdr').click(function(event) {
		$('div#dodajRestoranBackGroundDiv').hide();
		cancelInput("dodajRestoranForm");
		event.preventDefault();
	});	
	
	$('button#buttonXa').click(function(event) {
		$('div#artikalBackGroundDiv').hide();
		$('#pice').hide();
		$('#jelo').show();
		cancelInput("artikalForm");
		event.preventDefault();
	});	
	
	$('button#buttonXiiv').click(function(event) {
		$('div#izaberiVozilo').hide();
		cancelInput("izaberiVoziloForm");
		event.preventDefault();
	});	
	
	$('button#buttonXia').click(function(event) {
		$('div#izmenaArtikalBackGroundDiv').hide();
		$('#piceIzmena').hide();
		$('#jeloIzmena').show();
		cancelInput("artikalFormIzmena");
		event.preventDefault();
	});	
	
	$('button#buttonXidr').click(function(event) {
		$('div#izmeniRestoranBackGroundDiv').hide();
		cancelInput("izmeniRestoranForm");
		event.preventDefault();
	});	
	
	$('button#buttonXdv').click(function(event) {
		$('div#dodajVoziloBackGroundDiv').hide();
		cancelInput("dodajVoziloForm");
		event.preventDefault();
	});	
	
	$('button#buttonXipukd').click(function(event) {
		$('div#dodajArtikalSelectBackGroundDiv').hide();
		cancelInput("porudzbinaFormAdd");
		event.preventDefault();
	});	
	
	$('button#buttonXidv').click(function(event) {
		$('div#izmeniVoziloBackGroundDiv').hide();
		cancelInput("izmeniVoziloForm");
		event.preventDefault();
	});	
	
	$('button#buttonXikp').click(function(event) {
		$('div#kreiranjePorudzbinaAdminBackGroundDiv').hide();
		cancelInput("porudzbinaFormCreate");
		event.preventDefault();
	});	
	
	$('button#buttonXip').click(function(event) {
		$('div#izmenaPorudzbinaBackGroundDiv').hide();
		cancelInput("porudzbinaFormIzmena");
		event.preventDefault();
	});	
	
	$('button#buttonXidk').click(function(event) {
		$('div#izmeniKupcaBackGroundDiv').hide();
		cancelInput("izmeniKupcaForm");
		event.preventDefault();
	});	
	
	$('button#buttonXibp').click(function(event) {
		$('div#dodajBrojArtikalBackGroundDiv').hide();
		cancelInput("porudzbinaFormNumber");
		event.preventDefault();
	});	
	
	$(function() {
		$('#tipArtikla').change(function(){
			if($(this).val()=="jelo"){
				$('#pice').hide();
				$('#jelo').show();
			}else{
				$('#jelo').hide();
				$('#pice').show();
			}
		});

	});
	
	$(function() {
		$('#tipArtiklaIzmena').change(function(){
			if($(this).val()=="jelo"){
				$('#piceIzmena').hide();
				$('#jeloIzmena').show();
			}else{
				$('#jeloIzmena').hide();
				$('#piceIzmena').show();
			}
		});

	});
	
	$(document).ready(function() {
	    $("input[name$='StaSeTrazi']").click(function() {
	        var test = $(this).val();
	        console.log(test);
	        if(test=="1"){
	        	document.getElementById("pretragaTextBoxId").placeholder = "Naziv restorana";
	        	$("#r2").hide();
	        	$("#r3").hide();
	        	$("#r4").hide();
	        	$("#r5").hide();
	        	$("#r6").hide();
	        	$("#r7").hide();
	        	$("#r8").hide();
	        	$("#r9").hide();
	        	$("#r10").hide();
	        	$("#r11").hide();
	        	$("#r12").hide();
	        	$("#r13").hide();
	        	$("#jeloIliPiceFilter").hide();
	        	$("#r1").show();
	        	$("#r14").show();
	        	$("#adressRestaurantFilter").show();
	        	$("#categoryRestaurantFilter").show();
	        }else{    
	        	document.getElementById("pretragaTextBoxId").placeholder = "Naziv artikla";
	        	$("#r1").hide();
	        	$("#r14").hide();
	        	$("#adressRestaurantFilter").hide();
	        	$("#categoryRestaurantFilter").hide();
	         	$("#r2").show();
	        	$("#r3").show();
	        	$("#r4").show();
	        	$("#r5").show();
	        	$("#r6").show();
	        	$("#r7").show();
	        	$("#r8").show();
	        	$("#r9").show();
	        	$("#r10").show();
	        	$("#r11").show();
	        	$("#r12").show();
	        	$("#r13").show();
	        	$("#jeloIliPiceFilter").show();	        	
	        }
	    });
	});
	
	$("#dodajRestoranForm").submit(function(event){
		event.preventDefault();
		let name = $('#dodajRestoranForm input[name="nameRestaurant"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		var e = document.getElementById("categoryRestaurant");
		var category = e.options[e.selectedIndex].value;
		let city = $('#dodajRestoranForm input[name="cityRestaurant"]').val();
		let street = $('#dodajRestoranForm input[name="streetRestaurant"]').val();
		let number = $('#dodajRestoranForm input[name="numberRestaurant"]').val();
		if(name!="" && city!="" && street!="" && number!=""){
			$.ajax({
				url: 'rest/restorani', 
				type: "PUT" ,
				data: JSON.stringify({naziv:name, kategorija:category, adresa:city+"/"+street+"/"+number}),
				contentType: "application/json", //to oznacava ono sto saljemo
				success : function(restorani) {
					$("#tabelaRestorana tbody tr").remove();
					for(i=0; i<restorani.length; i++){
						if(restorani[i].isDeleted!=true){
							addRestoranTr(restorani[i]);	
						}
					}
					 cancelInput("dodajRestoranForm");
					$('div#dodajRestoranBackGroundDiv').hide();
				}	
			}); 
		}else{
			$('#errorDodajRestoran').show().delay(3000).fadeOut();	
		}
	});	
	
	$("#dodajVoziloForm").submit(function(event){
		event.preventDefault();
		let mark = $('#dodajVoziloForm input[name="carMark"]').val();
		let model = $('#dodajVoziloForm input[name="carModel"]').val();
		var e = document.getElementById("carType");
		var type = e.options[e.selectedIndex].value;
		let reg = $('#dodajVoziloForm input[name="carRegisterId"]').val();
		let year = $('#dodajVoziloForm input[name="carYear"]').val();
		let note = $('#dodajVoziloForm input[name="carNote"]').val();		
		var ee = document.getElementById("carUser");
		var typee = ee.options[ee.selectedIndex].value;
		$("#dodajVoziloBackGroundDiv").show();
		if(mark!="" && model!="" && reg!="" && year!=""){
			var sveURedu=0;
			if(isNaN(year)){
				$('#errorDodajVozilo1').show().delay(3000).fadeOut();
				sveURedu=1;
			}
			
			$.get({
				url: 'rest/vozila', 
				success : function(vozila) {
					var i;
					var pronasao=0;
					for(i=0; i<vozila.length; i++){
						if(vozila[i].registarska_oznaka==reg && vozila[i].isDeleted!=true){
							pronasao=1;
							break;
						}
					}
					
					if(pronasao==0){
						if(sveURedu==0){	
								$.ajax({
									url: 'rest/vozila', 
									type: "PUT" ,
									data: JSON.stringify({marka:mark, model:model, tip:type, registarska_oznaka:reg, godina_proizvodnje:year,vozilo_trenutno_u_upotrebi:false, napomena:note, isDeleted:false, korisnikVozila:typee}),
									contentType: "application/json", //to oznacava ono sto saljemo
									success : function(vozila) {
										$("#tabelaVozila tbody tr").remove();
										addVoziloTr(vozila);
									    cancelInput("dodajVoziloForm");
										$('div#dodajVoziloBackGroundDiv').hide();
									}	
								});
							}
					}else{
						$('#errorDodajVozilo').show().delay(3000).fadeOut();
					}
				}
			});
		}else{
			$('#errorDodajVozilo2').show().delay(3000).fadeOut();	
		}		
	});	
	
	$("#buttonIzlistajRestorane").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#tabelaRestoranaDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/restorani',
			success: function(restorani){				
				var i;
				$("#tabelaRestorana tbody tr").remove();
				for(i=0; i<restorani.length; i++){
					if(restorani[i].isDeleted!=true){
						addRestoranTr(restorani[i]);
					}
				}
			}
		});
	});
	
	$(document).on("click","#izbrisiRestoran",function(e){
		e.preventDefault();
		let url= $(this).attr('href');
		$.ajax({
			url : url,
			type: 'DELETE',
			success: function(restorani){
				$("#tabelaRestorana tbody tr").remove();
				for(i=0; i<restorani.length; i++){
					if(restorani[i].isDeleted!=true){
						addRestoranTr(restorani[i]);
					}
				}
			}
		})
	});
	
	$(document).on("click","#izbrisiArtikal",function(e){
		e.preventDefault();
		let url= $(this).attr('href');
		$.ajax({
			url : url,
			type: 'DELETE',
			success: function(artikli){
				$("#tabelaArtikala tbody tr").remove();
				$("#tabelaArtikalaP tbody tr").remove();
				for(i=0; i<artikli.length; i++){
					if(artikli[i].isDeleted!=true){
						addArtikalTr(artikli[i]);	
					}
				}
			}
		})
	});
	
	$("#artikalForm").submit(function(event){
		event.preventDefault();
		//var id=$('#artikalForm input[name="idRestoranaZaArtikle"]').val();
		var e = document.getElementById("tipArtikla");
		var category = e.options[e.selectedIndex].value;
		var idR = document.getElementById("selectRestoranZaArtikal");
		var idRS = idR.options[idR.selectedIndex].value;
		let name = $('#artikalForm input[name="nameArtikal"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		let price = $('#artikalForm input[name="priceArtikal"]').val();
		let amount="";
		if(category=="jelo"){
			console.log(category+" g");
			amount = $('#artikalForm input[name="amountArtikal"]').val()+' g';
		}else{
			amount = $('#artikalForm input[name="amountArtikal"]').val()+' ml';
		}
		let description = $('#artikalForm input[name="descriptionArtikal"]').val();
		if(name!="" && price!="" && amount!=""){
			var sveOk=0;
			if(isNaN(price) || price.includes('-')){
				var $elu = $("#errorArtikalUnos"),
			    x = 3000,
			    originalColor ="#f5f5f5";

				$elu.css("color", "red");
				setTimeout(function(){
				  $elu.css("color", originalColor);
				}, x);
				
				sveOk=1;
			}
			
			if(isNaN($('#artikalForm input[name="amountArtikal"]').val()) || amount.includes('-')){
				var $el = $("#errorArtikalUnos1"),
			    x = 3000,
			    originalColor ="#f5f5f5";

				$el.css("color", "red");
				setTimeout(function(){
				  $el.css("color", originalColor);
				}, x);
				
				sveOk=1;
			}
			
			if(sveOk==0){
				$.ajax({
					url: 'rest/artikli/'+idRS, 
					type: "PUT",
					data: JSON.stringify({naziv:name, tip:category, cena:price, kolicina:amount, opis:description}),
					contentType: "application/json", //to oznacava ono sto saljemo
					success : function(artikli) {
						$("#tabelaArtikala tbody tr").remove();
						$("#tabelaArtikalaP tbody tr").remove();
						for(i=0; i<artikli.length; i++){	
							if(artikli[i].isDeleted!=true){
								if(idRS==artikli[i].idRestorana){
									addArtikalTr(artikli[i]);	
								}
							}
						}
						 cancelInput("artikalForm");
						 $('div#artikalBackGroundDiv').hide();
					}	
				});
			}
		}else{
			var $el = $("#errorArtikalUnos2"),
		    x = 3000,
		    originalColor ="#f5f5f5";

			$el.css("color", "red");
			setTimeout(function(){
			  $el.css("color", originalColor);
			}, x);
		}
	});	
	
	//$('#errorLogin').show().delay(3000).fadeOut();
	$("#porudzbinaFormIzmena").submit(function(event){
		event.preventDefault();
		let id=$('#porudzbinaFormIzmena input[name="nameIdP"]').val();
		let customer=$('#porudzbinaFormIzmena input[name="nameKupacP"]').val();
		var e = document.getElementById("statusPorudzbinaIzmena");
		var category = e.options[e.selectedIndex].value;
		let note = $('#porudzbinaFormIzmena input[name="nameNapomenaP"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		let deliverer = $('#porudzbinaFormIzmena input[name="nameDostavljacP"]').val();
		
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){
				$.get({
					url: 'rest/kupci',
					success: function(kupci) {
						var i, j;
						var pronasao=0;
						var pronasaoD=0;
						var DostavljacVecIma=0;
						for(i=0; i<kupci.length; i++){
							if(kupci[i].korisnicko_ime==customer){
								pronasao=1;
								break;
							}
						}
					
						for(j=0; j<kupci.length; j++){
							if(kupci[j].korisnicko_ime==deliverer && kupci[j].uloga=="dostavljac"){							
								pronasaoD=1;
								break;
							}
						}
						
						if(category=="Dostava u toku"){	
							var h;
							for(h=0; h<porudzbine.length; h++){
								if(porudzbine[h].status_porudzbine=="Dostava u toku" && porudzbine[h].dostavljac==deliverer && porudzbine[h].isDeleted!=true){	
									DostavljacVecIma=1;
									console.log("dd "+DostavljacVecIma);
									break;
								}
							}					
						}
						
						console.log("d "+DostavljacVecIma);
						if(pronasao==1 && pronasaoD==1 && DostavljacVecIma==0){
							$.ajax({
								url: 'rest/porudzbinee/'+id, 
								type: "PUT",
								data: JSON.stringify({kupac:customer, status_porudzbine:category, napomena:note, dostavljac:deliverer}),
								contentType: "application/json", //to oznacava ono sto saljemo
								success : function(porudzbine) {
									var i;
									$("#tabelaPorudzbinaAdmin tbody tr").remove();
									for(i=0; i<porudzbine.length; i++){
										if(porudzbine[i].isDeleted!=true){
											addPorudzbinaTr(porudzbine[i]);
										}
									}
									cancelInput("porudzbinaFormIzmena");
									$('div#izmenaPorudzbinaBackGroundDiv').hide();
								}	
							});
						}else{
							if(pronasao==0 && pronasaoD==0){
								$('#errorIzmenaP').show().delay(3000).fadeOut();
								$('#errorIzmenaP1').show().delay(3000).fadeOut();
							}else if(pronasao==1 && pronasaoD==0){
								$('#errorIzmenaP1').show().delay(3000).fadeOut();
							}else if(pronasao==0 && pronasaoD==1){
								$('#errorIzmenaP').show().delay(3000).fadeOut();
							}else{
								$('#errorIzmenaP2').show().delay(3000).fadeOut();
							}
						}
					}
				});	
			}
		});	
	});	
	
	$("#porudzbinaFormAdd").submit(function(event){
		event.preventDefault();
		let id=$('#porudzbinaFormAdd input[name="idArtiklaKSD"]').val();
		let broj=$('#porudzbinaFormAdd input[name=selectBrojArtikla]').val();
		var e = document.getElementById("selectPorudzbinuUKSD");
		var category = e.options[e.selectedIndex].value;
		var a=null;
		if(isNaN(broj) || parseInt(broj)>11 || broj==""){
			$('#errorIzmenaBA').show().delay(3000).fadeOut();
		}else{
			$.get({
				url: 'rest/artikli',
				success: function(artikli){
					var g;
					for(g=0; g<artikli.length; g++){
						if(artikli[g].id==id){	
							a=artikli[g];
							$.get({
								url: 'rest/porudzbinee',
								success: function(porudzbine){
									var j;
									for(j=0; j<porudzbine.length; j++){
										if(porudzbine[j].id==category){
											var h;
											var pronadjen=0;
											for(h=0; h<porudzbine[j].stavke.length; h++){
												if(porudzbine[j].stavke[h].id==a.id){
													alert("Artikal je već dodat u izabranu porudžbinu.");
													$('#dodajArtikalSelectBackGroundDiv').hide();
													pronadjen=1;
													break;
												}
											}
											if(pronadjen==0){
												$.ajax({
													url: 'rest/porudzbinee/add/'+porudzbine[j].id,
													type: 'POST',
													data: JSON.stringify({naziv:a.naziv, tip:a.tip, cena:a.cena, opis:a.opis, kolicina:a.kolicina, id:a.id, idRestorana:a.idRestorana, isDeleted:a.isDeleted, broj_u_por:broj }),
													contentType: "application/json",
													success: function(){
														$('#dodajArtikalSelectBackGroundDiv').hide();
														console.log("sdggdfh"+a.id+" "+broj);
														$.ajax({
															url: 'rest/artikli/a/'+a.id+"/"+broj,
															type: "PUT",
															success: function(){	
																cancelInput("porudzbinaFormAdd");
															}
														});		
													}
												});
											}
										}
									}
								}
							});
						}
					}
				}
			});
		}
	});
	
	$("#porudzbinaFormCreate").submit(function(event){
		event.preventDefault();
		let customer=$('#porudzbinaFormCreate input[name="nameKupacKP"]').val();
		var e = document.getElementById("statusPorudzbinaIzmenaK");
		var category = e.options[e.selectedIndex].value;
		let note = $('#porudzbinaFormCreate input[name="nameNapomenaKP"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		let deliverer = $('#porudzbinaFormCreate input[name="nameDostavljacKP"]').val();
		if(customer!="" && deliverer!=""){
			$.get({
				url: 'rest/porudzbinee',
				success: function(porudzbine){
					$.get({
						url: 'rest/kupci',
						success: function(kupci) {
							var i, j;
							var pronasao=0;
							var pronasaoD=0;
							var DostavljacVecIma=0;
							for(i=0; i<kupci.length; i++){
								if(kupci[i].korisnicko_ime==customer){
									pronasao=1;
									break;
								}
							}
						
							for(j=0; j<kupci.length; j++){
								if(kupci[j].korisnicko_ime==deliverer && kupci[j].uloga=="dostavljac"){
									pronasaoD=1;
									break;
								}
							}
							
							if(category=="Dostava u toku"){	
								var h;
								for(h=0; h<porudzbine.length; h++){
									if(porudzbine[h].status_porudzbine=="Dostava u toku" && porudzbine[h].dostavljac==deliverer  && porudzbine[h].isDeleted!=true){	
										DostavljacVecIma=1;
										console.log("dd "+DostavljacVecIma);
										break;
									}
								}					
							}
							
							if(pronasao==1 && pronasaoD==1 && DostavljacVecIma==0){
								$.ajax({
									url: 'rest/porudzbinee/', 
									type: "PUT",
									data: JSON.stringify({kupac:customer, status_porudzbine:category, napomena:note, dostavljac:deliverer}),
									contentType: "application/json", //to oznacava ono sto saljemo
									success : function() {
										$.get({
											url: 'rest/porudzbinee/', 
											success: function(porudzbine){
												var i;
												$("#tabelaPorudzbinaAdmin tbody tr").remove();
												for(i=0; i<porudzbine.length; i++){
													if(porudzbine[i].isDeleted!=true){
														addPorudzbinaTr(porudzbine[i]);
													}
												}
												cancelInput("porudzbinaFormCreate");
												$('div#kreiranjePorudzbinaAdminBackGroundDiv').hide();
											}
										});
									}	
								});
							}else{
								if(pronasao==0 && pronasaoD==0){
									$('#errorIzmenaKP').show().delay(3000).fadeOut();
									$('#errorIzmenaKP1').show().delay(3000).fadeOut();
								}else if(pronasao==1 && pronasaoD==0){
									$('#errorIzmenaKP1').show().delay(3000).fadeOut();
								}else if(pronasao==0 && pronasaoD==1){
									$('#errorIzmenaKP').show().delay(3000).fadeOut();
								}else{
									$('#errorIzmenaKP3').show().delay(3000).fadeOut();
								}
							}
						}
					});
				}
			});
		}else{
			$('#errorIzmenaKP2').show().delay(3000).fadeOut();
		}
	});
	
	$("#artikalFormIzmena").submit(function(event){
		event.preventDefault();
		//var t=$('#artikalFormIzmena input[name="idRestoranaZaArtikle"]').val();
		var e = document.getElementById("tipArtiklaIzmena");
		var category = e.options[e.selectedIndex].value;
		var idR = document.getElementById("selectRestoranZaArtikalIzmena");
		var idRS = idR.options[idR.selectedIndex].value;
		let name = $('#artikalFormIzmena input[name="nameArtikal"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		let price = $('#artikalFormIzmena input[name="priceArtikal"]').val();
		let amount="";
		if(category=="jelo"){
			amount = $('#artikalFormIzmena input[name="amountArtikal"]').val()+' g';
		}else{
			amount = $('#artikalFormIzmena input[name="amountArtikal"]').val()+' ml';
		}
		let description = $('#artikalFormIzmena input[name="descriptionArtikal"]').val();
		let id=$('#artikalFormIzmena input[name="idArtikla"]').val();
		console.log("name: "+name);
		console.log("price: "+price);
		console.log("amount: "+amount);
		if(name!="" && price!="" && amount!=""){
			var sveOk=0;
			if(isNaN(price) || price.includes('-')){
				var $elu = $("#errorArtikalIzmena"),
			    x = 3000,
			    originalColor ="#f5f5f5";

				$elu.css("color", "red");
				setTimeout(function(){
				  $elu.css("color", originalColor);
				}, x);
				
				sveOk=1;
			}
			
			if(isNaN($('#artikalFormIzmena input[name="amountArtikal"]').val()) || amount.includes('-')){
				var $el = $("#errorArtikalIzmena1"),
			    x = 3000,
			    originalColor ="#f5f5f5";

				$el.css("color", "red");
				setTimeout(function(){
				  $el.css("color", originalColor);
				}, x);
				
				sveOk=1;
			}
			
			if(sveOk==0){
				$.ajax({
					url: 'rest/artikli/izmeni', 
					type: "PUT",
					data: JSON.stringify({id:id, naziv:name, tip:category, cena:price, kolicina:amount, opis:description, idRestorana:idRS}),
					contentType: "application/json", //to oznacava ono sto saljemo
					success : function(artikli) {
						var i;
						$("#tabelaArtikala tbody tr").remove();
						$("#tabelaArtikalaP tbody tr").remove();
						for(i=0; i<artikli.length; i++){
							console.log("IDRESTORANA: "+idRS+" == "+artikli[i].idRestorana);
							if(idRS==artikli[i].idRestorana && artikli[i].isDeleted!=true){
								addArtikalTr(artikli[i]);
							}
						}
						  cancelInput("artikalFormIzmena");
						  $('div#izmenaArtikalBackGroundDiv').hide();	
					}	
				});	 
			}
		}else{
			var $el = $("#errorArtikalIzmena2"),
			    x = 3000,
			    originalColor ="#f5f5f5";

			$el.css("color", "red");
			setTimeout(function(){
			  $el.css("color", originalColor);
			}, x);
		}
	});	
	

	
	$("#izmeniRestoranForm").submit(function(event){
		event.preventDefault();
		let name = $('#izmeniRestoranForm input[name="nameRestaurant"]').val(); //ovde moramo dodatno da naglasimo da uzimamo input iz forme izmene jer ako to nismo stavili a 2 forme imaju isti id pa ce uzeti formu iz forme dodaj
		var e = document.getElementById("categoryRestaurantIzmena");
		var category = e.options[e.selectedIndex].value;
		let city = $('#izmeniRestoranForm input[name="cityRestaurant"]').val();
		let street = $('#izmeniRestoranForm input[name="streetRestaurant"]').val();
		let number = $('#izmeniRestoranForm input[name="numberRestaurant"]').val();
		let id=$('#izmeniRestoranForm input[name="idRestaurant"]').val();
		if(name!="" && city!="" && street!="" && number!=""){
			$.ajax({
				url: 'rest/restorani/izmeni', 
				type: "PUT" ,
				data: JSON.stringify({id:id, naziv:name, kategorija:category, adresa:city+"/"+street+" "+number}),
				contentType: "application/json", //to oznacava ono sto saljemo
				success : function(restorani) {
					var i;
					$("#tabelaRestorana tbody tr").remove();
					for(i=0; i<restorani.length; i++){
						if(restorani[i].isDeleted!=true){
							addRestoranTr(restorani[i]);
						}
					}
					 cancelInput("izmeniRestoranForm");
					$('div#izmeniRestoranBackGroundDiv').hide();
				}	
			});
		}else{
			$('#errorIzmeniRestoran').show().delay(3000).fadeOut();
		}  
	});	
	
	
	$("#izmeniVoziloForm").submit(function(event){
		event.preventDefault();
		let mark = $('#izmeniVoziloForm input[name="carMark"]').val();
		let model = $('#izmeniVoziloForm input[name="carModel"]').val();
		var e = document.getElementById("carTypeIzmena");
		var type = e.options[e.selectedIndex].value;
		let reg = $('#izmeniVoziloForm input[name="carRegisterId"]').val();
		let year = $('#izmeniVoziloForm input[name="carYear"]').val();
		let note = $('#izmeniVoziloForm input[name="carNote"]').val();
		let id=$('#izmeniVoziloForm input[name="carId"]').val();
		var ee = document.getElementById("carUserI");
		var typee = ee.options[ee.selectedIndex].value;
		if(mark!="" && model!="" && reg!="" && year!=""){
			var sveURedu=0;
			if(isNaN(year)){
				$('#errorIzmeniVozilo1').show().delay(3000).fadeOut();
				sveURedu=1;
			}
			
			$.get({
				url: 'rest/vozila',
				success : function(vozila) {
					var i;
					var pronasao=0;
					for(i=0; i<vozila.length; i++){
						if(vozila[i].registarska_oznaka==reg && vozila[i].isDeleted!=true && vozila[i].id!=id){
							pronasao=1;
							break;
						}
					}
					
					if(pronasao==0){
						if(sveURedu==0){	
							$.ajax({
								url: 'rest/vozila/izmeni', 
								type: "PUT" ,
								data: JSON.stringify({id:id, marka:mark, model:model, tip:type, registarska_oznaka:reg, godina_proizvodnje:year, napomena:note, korisnikVozila: typee}),
								contentType: "application/json", //to oznacava ono sto saljemo
								success : function(vozila) {
									var i;
									$("#tabelaVozila tbody tr").remove();
										addVoziloTr(vozila);
										cancelInput("izmeniVoziloForm");
										$('div#izmeniVoziloBackGroundDiv').hide();
								}	
							});
						}
					}else{
						$('#errorIzmeniVozilo').show().delay(3000).fadeOut();
					}
				}
			});
		}else{
			$('#errorIzmeniVozilo2').show().delay(3000).fadeOut();
		} 
	});	
	
	$("#izmeniKupcaForm").submit(function(event){
		event.preventDefault();
		let username = $('#izmeniKupcaForm input[name="usernameKupac"]').val();
		let password = $('#izmeniKupcaForm input[name="lozinkaKupac"]').val();
		let name = $('#izmeniKupcaForm input[name="imeKupac"]').val();
		let surname = $('#izmeniKupcaForm input[name="prezimeKupac"]').val();
		let phone= $('#izmeniKupcaForm input[name="telefonKupac"]').val();
		let email = $('#izmeniKupcaForm input[name="emailKupac"]').val();
		let datum = $('#izmeniKupcaForm input[name="datumKupac"]').val();
		var e = document.getElementById("userRoleIzmena");
		var uloga = e.options[e.selectedIndex].value;
		
		$.ajax({
			url: 'rest/kupci/izmeni', 
			type: "PUT" ,
			data: JSON.stringify({korisnicko_ime:username, lozinka:password, ime:name, prezime:surname, kontakt_telefon:phone, email:email, datum_registracije:datum, uloga:uloga}),
			contentType: "application/json",
			success : function(kupci) {
				var i;
				$("#tabelaKorisnika tbody tr").remove();
				for(i=0; i<kupci.length; i++){
						addKupacTr(kupci[i]);
				}
				$.get({
					url: 'rest/porudzbinee', 
					success: function(porudzbine){
						var r;
						for(r=0; r<porudzbine.length; r++){
							if(porudzbine[r].dostavljac==username){
								if(porudzbine[r].status_porudzbine=="Dostava u toku" || porudzbine[r].status_porudzbine=="Poruceno"){
									$.post({
										url:"rest/porudzbinee/promenaStatusa/"+porudzbine[r].id,
										success: function(){
											
										}
									});
								}
							}
						}
					}
				});
			}	
		})
	    cancelInput("izmeniKupcaForm");
		$('div#izmeniKupcaBackGroundDiv').hide();
	});
	
	$("#korpaForm").submit(function(event){
		event.preventDefault();
		let napomena=$('#korpaForm input[name="napomenaTextArea"]').val();
		var cena=0;
		var posto=0;
		var bod;
		if($("#bodoviDaLiIhIma").val().length == 0){
			bod=0;
		}else{
			bod=$('#korpaForm input[name="bodoviTextBox"]').val();
		}		
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',//Nadji kupca
			success: function(kupac){
				if(kupac.lista_stavki.length!=0){
					if(kupac.bodovi<bod || bod<0 || isNaN(bod)){
						alert("Unos bodova mora biti pozitivan broj koji je manji ili jednak vašem broju bodova.");
					}else{
						var i;
						for(i=0; i<kupac.lista_stavki.length; i++){	
							cena+=kupac.lista_stavki[i].cena*kupac.lista_stavki[i].broj_u_por;//Cena njegove porudzbine
						}
						posto=(cena/100)*(bod*3);
						cena=cena-posto;
						console.log("Cena nakon obrade mogucih bodova: "+cena+" rsd");
						$.ajax({
							url: 'rest/porudzbinee', //Posalji porudzbinu da se doda u listu svih porudzbina
							type: "PUT" ,
							data: JSON.stringify({stavke:kupac.lista_stavki, kupac:kupac.korisnicko_ime, napomena:napomena, cena_porudzbine:cena}),
							contentType: "application/json", //to oznacava ono sto saljemo
							success : function() {
								$.post({
									url:'rest/kupci/k/'+kupac.korisnicko_ime+"/"+bod,
									success: function(a){
										$("#bodoviP").text("Bodove možete iskoristiti za ostvarivanje popusta pri porudžbini. Trenutno imate "+a+" bod(ova).")
									}
								});
								$.get({
									url: 'rest/artikli', 
									success : function(artikli) {
										var t, p;
										for(t=0; t<artikli.length; t++){
											for(p=0; p<kupac.lista_stavki.length; p++){
												if(artikli[t].id==kupac.lista_stavki[p].id){
													$.ajax({
														url: 'rest/artikli/a/'+artikli[t].id+"/"+kupac.lista_stavki[p].broj_u_por, //Dodajem broj prodanih iz trenutne porudzbine u broj ukupno prodanih artikala
														type: "PUT",
														success: function(){	
														}
													});
												}
											}
										}
										$.post({
											url: 'rest/kupci/isprazniKorpu',
											success: function(artikli) {
												var g;
												$("#tabelaTrenutneKorpe tbody tr").remove();
												$('#korpaForm input[name="napomenaTextArea"]').val("");
												$("#ukupnaCena").text("Ukupna cena: 0 rsd");
												alert("Uspešno poručeno! Hvala na kupovini.");
												cancelInput("korpaForm");
												for(g=0; g<artikli.length; g++){
													addStavkuTr(artikli[g]);
												}
											}
										});
									}
								});
							}	
						});
					}
				}else{
					alert("Vaša korpa je prazna. Dodajte artikle koje želite da poručite.");
				}
			}
		});
		
	});
	
	$("#porudzbinaFormNumber").submit(function(event){
		event.preventDefault();
		let id=$('#porudzbinaFormNumber input[name="idArtiklaKSB"]').val();
		let broj = $('#porudzbinaFormNumber input[name="brojArtikalaKojiSD"]').val();
		if(isNaN(broj) || parseInt(broj)>11 || broj==""){
			$('#errorBrojArtikala').show().delay(3000).fadeOut();
		}else{
			$.get({
				url:'rest/artikli',
				success: function(artikli){
					var a;
					var i;
					for(i=0; i<artikli.length; i++){
						if(artikli[i].id==id){
							a=artikli[i];
							break;
						}	
					}
					$.post({
						url: 'rest/kupci/dodajStavku',
						data: JSON.stringify({id: a.id, tip:a.tip, naziv:a.naziv, cena:a.cena, kolicina:a.kolicina, broj_u_por:broj}),
						contentType: 'application/json',
						success:function() {	
							$("#dodajBrojArtikalBackGroundDiv").hide();
							cancelInput("porudzbinaFormNumber");
						}
					});
				}
			});
		}
	});
	
	$("#buttonMojaStranica").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$('div#tabelaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#mojaKorpaDiv').hide();
		$('div#tabelaArtikalaPrethodnihPorudzbinaDiv').hide();
		$('div#mojaStranicaDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				$.get({
					url: 'rest/restorani',
					success: function(restorani){
						var i,j;
						$("#tabelaOmiljenihRestorana tbody tr").remove();
						for(i=0; i<kupac.lista_omiljenih_restorana.length; i++){
							for(j=0; j<restorani.length; j++){
								if(kupac.lista_omiljenih_restorana[i].id==restorani[j].id && restorani[j].isDeleted!=true){
									addOmiljeniRestoranTr(restorani[j]);
									break;
								}
							}
						}
						
						$.get({
							url: 'rest/porudzbinee',
							success: function(porudzbine){
								var l;
								$("#tabelaPrethodnihPorudzbina tbody tr").remove();
								for(l=0; l<porudzbine.length; l++){
									console.log( porudzbine[l].kupac+"=="+kupac.korisnicko_ime);
									if(porudzbine[l].isDeleted!=true && porudzbine[l].kupac==kupac.korisnicko_ime)
										addPrethodnePorudzbine(porudzbine[l]);	
								}
							}
						});
					}
				});
			}
		});
	});
	
	$("#homeButton").click(function(event){
		$('div#mojaKorpaDiv').hide();
		$('div#mojaStranicaDiv').hide();
		$('div#tabelaArtikalaPrethodnihPorudzbinaDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#tremutmaPrudzbinaDiv').hide();
		$('div.divParent').show();
		tabeleNajpopularnijih();
		event.preventDefault();
	});
	
	$("#buttonKorpa").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#mojaStranicaDiv').hide();
		$('div#tabelaArtikalaPrethodnihPorudzbinaDiv').hide();
		$('div#mojaKorpaDiv').show();
		$("#ukupnaCena").text("");
		event.preventDefault();
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				var i;
				var cena=0;
				$("#tabelaTrenutneKorpe tbody tr").remove();
				for(i=0; i<kupac.lista_stavki.length; i++){
					addStavkuTr(kupac.lista_stavki[i]);	
					cena+=kupac.lista_stavki[i].cena*kupac.lista_stavki[i].broj_u_por;
				}
				$("#ukupnaCena").text("Ukupna cena: "+cena+" rsd");
				$("#bodoviP").text("Bodove možete iskoristiti za ostvarivanje popusta pri porudžbini. Trenutno imate "+kupac.bodovi+" bod(ova).")
			}
		});
	});
	
	$('#buttonKreirajPorudzbinuAdmin').click(function(event){
		event.preventDefault();
		$('div#kreiranjePorudzbinaAdminBackGroundDiv').show();
	});
	
	$("#buttonTrenutnaPorudzbina").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#tremutmaPrudzbinaDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',
			success: function(kupac){
				$.get({
					url: 'rest/porudzbinee',
					success: function(porudzbine){				
						$("#tabelaTrenutnePorudzbine tbody tr").remove();
						//$("#selectVoziloZaDostavu").empty();						
						var i, j;
						for(i=0; i<porudzbine.length; i++){
							if(porudzbine[i].isDeleted!=true && porudzbine[i].status_porudzbine=="Dostava u toku" && porudzbine[i].dostavljac==kupac.korisnicko_ime){
								$("#p1").text("Kupac: "+porudzbine[i].kupac);
								$("#p2").text("Status porudžbine: "+porudzbine[i].status_porudzbine);
								$("#p3").text("Datum porudžbine: "+porudzbine[i].datum_i_vreme_porudzbine);
								if(porudzbine[i].napomena!=null){
									$("#p4").text("Napomena: "+porudzbine[i].napomena);
								}else{
									$("#p4").text("Napomena: "+"");
								}
								$("#p5").text("Vozilo: ");
								for(j=0; j<porudzbine[i].stavke.length; j++){
									addArtikleDTr(porudzbine[i].stavke[j]);
								}
								$("#p6").text("Ukupno za naplatu: "+porudzbine[i].cena_porudzbine + " rsd");
								break;
							}else{
								$("#p1").text("Kupac: ");
								$("#p2").text("Status porudžbine: ");
								$("#p3").text("Datum porudžbine: ");
								$("#p4").text("Napomena: ");
								$("#p5").text("Vozilo: ");
								$("#p6").text("Ukupno za naplatu: ");
							}
						}
						/*$.get({
							url: 'rest/vozila',
							success: function(vozila){
								var b;
								for(b=0; b<vozila.length; b++){
									if(vozila[b].isDeleted!=true && vozila[b].korisnikVozila==kupac.korisnicko_ime){
										$('#selectVoziloZaDostavu').append( '<option value="'+vozila[b].id+'">'+vozila[b].marka+" "+vozila[b].model+'</option>' );
									}
								}			
							}
						});*/
						
					}
				});
			}
		});
	});
	
	$("#buttonIzlistajPorudzbineD").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#tremutmaPrudzbinaDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#izlistajPorudzbineDDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){				
				$("#tabelaPorudzbinaD tbody tr").remove();
				var i;
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].isDeleted!=true && porudzbine[i].status_porudzbine=="Poruceno"){
						addPorudzbinuDTr(porudzbine[i]);
					}
				}
			}
		});
	});
	
	$("#buttonIzlistajVozila").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#mojaStranicaDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#tabelaVozilaDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/vozila',
			success: function(vozila){				
				$("#tabelaVozila tbody tr").remove();
						addVoziloTr(vozila);			
			}
		});
	});
	
	$("#buttonIzlistajPorudzbineAdmin").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#mojaStranicaDiv').hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPrudzbineAdminDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/porudzbinee',
			success: function(porudzbine){
				var i;
				$("#tabelaPorudzbinaAdmin tbody tr").remove();
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].isDeleted!=true){
						addPorudzbinaTr(porudzbine[i]);
					}
				}
			}
		});
	});
	/*$('div#artikalBackGroundDiv').show();
	event.preventDefault();*/
	
	$("#dodajArtikalButton1").click(function(event){
		$("#selectRestoranZaArtikal").empty();
		$.get({
			url: "rest/restorani",
			success: function(restorani){
				var i;
				for(i=0; i<restorani.length; i++){
					if(restorani[i].isDeleted!=true){
						$("#selectRestoranZaArtikal").append('<option value='+restorani[i].id+'>'+restorani[i].naziv+" "+restorani[i].adresa+'</option>');
					}
				}
			}
		});
		$('div#artikalBackGroundDiv').show();
		event.preventDefault();
	});
	
	$("#izlistajArtikalButton1").click(function(event){
		event.preventDefault();
		$('div.divParent').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#tabelaKorisnikaDiv').hide();
		$("#tabelaArtikalaDiv").show();
		$("#tabelaArtikala tbody tr").remove();
		$("#tabelaArtikalaP tbody tr").remove();
		$.get({
			url: "rest/artikli",
			success: function(artikli){
				var i;
				for(i=0; i<artikli.length; i++){
					if(artikli[i].isDeleted!=true){
						addArtikalTr(artikli[i]);
					}
				}
			}
		});
	});
	
	$("#zavrsiPorudzbinuButton").click(function(event){
		event.preventDefault();
		$("#tabelaTrenutnePorudzbine tbody tr").remove();
		$("#p1").text("Kupac: ");
		$("#p2").text("Status porudžbine: ");
		$("#p3").text("Datum porudžbine: ");
		$("#p4").text("Napomena: ");
		var por=null;
		$.get({
			url: 'rest/kupci/ulogovanKorisnik',//Ulogovan dostavljac
			success: function(kupac){
				$.get({
					url: 'rest/porudzbinee',//Nadji njegovu dostavu koja je u toku
					success: function(porudzbine){
						var i;
						for(i=0; i<porudzbine.length; i++){
							if(porudzbine[i].isDeleted!=true && porudzbine[i].status_porudzbine=="Dostava u toku" && porudzbine[i].dostavljac==kupac.korisnicko_ime){
								por=porudzbine[i];
								$.post({
									url: 'rest/porudzbinee/zavrsiPorudzbinu/'+porudzbine[i].id,//Zavrsi porudzbinu
									success: function(){
										$.get({
											url: 'rest/kupci',//Nadji kupca cija je dostava zavrsena
											success: function(kupci){
												var w;
												for(w=0; w<kupci.length; w++){
													if(por.kupac==kupci[w].korisnicko_ime && por.cena_porudzbine>500){
														$.post({
															url: 'rest/kupci/bodovi/'+kupci[w].korisnicko_ime,// i dodaj mu bod ako je cena >500
															success: function(){
															}
														});
													}
												}
												$.get({
													url: 'rest/vozila',
													success: function(vozila){
														var r;
														for(r=0; r<vozila.length; r++){
															if(vozila[r].korisnikVozila==kupac.korisnicko_ime && vozila[r].vozilo_trenutno_u_upotrebi==true){
																$.post({
																	url: 'rest/vozila/v/'+vozila[r].id,//Oslobodi vozilo koje je koristio dostavljac
																	success: function(){
																	}
																});
															}
														}
													}
												});
											}
										});
									}					
								});
							}
						}	
					}
				});
			}
		});
	});
	
	
	$(document).on("click","#izbrisiVozilo",function(e){
		e.preventDefault();
		let url= $(this).attr('href');
		$.ajax({
			url : url,
			type: 'DELETE',
			success: function(vozila){
				$("#tabelaVozila tbody tr").remove();
				addVoziloTr(vozila);
			}
		})
	});

	$(document).on("click","#izbrisiPorudzbinu",function(e){
		e.preventDefault();
		let url= $(this).attr('href');
		$.ajax({
			url : url,
			type: 'DELETE',
			success: function(porudzbine){
				var i;
				$("#tabelaPorudzbinaAdmin tbody tr").remove();
				for(i=0; i<porudzbine.length; i++){
					if(porudzbine[i].isDeleted!=true){
						addPorudzbinaTr(porudzbine[i]);
					}
				}
			}
		})
	});
	
	$("#buttonKorisnici").click(function(event){
		$('div.divParent').hide();
		$('div#tabelaRestoranaDiv').hide();
		$('div#tabelaVozilaDiv').hide();
		$('div#tabelaKategorijaRestoranaDiv').hide();
		$("div#tabelaArtikalaDiv").hide();
		$('div#izlistajPorudzbineDDiv').hide();
		$('div#tremutmaPorudzbinaDiv').hide();
		$('div#artikliPorudzbineDDiv').hide();
		$('div#mojaStranicaDiv').hide();
		$('div#artikliPorudzbineDiv').hide();
		$('div#izlistajPrudzbineAdminDiv').hide();
		$('div#tabelaKorisnikaDiv').show();
		event.preventDefault();
		$.get({
			url: 'rest/kupci',
			success: function(kupci){				
				var i;
				$("#tabelaKorisnika tbody tr").remove();
				for(i=0; i<kupci.length; i++){
					addKupacTr(kupci[i]);
				}
			}
		});
	});

///////////////////////////////////////////////////////////////////////////////////////
//KATEGORIJE RESTORANA/////////////////////////////////////////////////////////////////
	$("#domacaKuhinjaForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Domaca Kuhinja");
		
	});
	
	$("#rostiljForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Rostilj");
		
	});
	
	$("#kineskaKuhinjaForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Kineska Kuhinja");
		
	});
	
	$("#indijskaKuhinjaForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Indijska Kuhinja");
		
	});
	
	$("#poslasticarnicaForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Poslasticarnica");		
	});
	
	$("#picerijaForm").submit(function(event){
		event.preventDefault();
		kategorijeRestoranaIzlistaj("Picerija");
		
	});
///////////////////////////////////////////////////////////////////////////////////////
//FILTER///////////////////////////////////////////////////////////////////////////////
	
	$("#mainMenu").submit(function(event){
		event.preventDefault();
		let nameOrAddress = $('#mainMenu input[name="pretragaTextBox"]').val();
		let adresa=$('#mainMenu input[name="adresaRestoranaFilter"]').val();
		let price = $('#mainMenu input[name="cenaInputFilter"]').val();
		let restaurant=$('#mainMenu input[name="restoranInputFilter"]').val();
		var e = document.getElementById("categoryRestaurantFilter");
		var type = e.options[e.selectedIndex].value;
		var e = document.getElementById("jeloIliPiceFilter");
		var typeA = e.options[e.selectedIndex].value;
		var listaArtikala=[];
		var listaR=[];
		if (document.getElementById('restoranRadio').checked) {
			$.get({
				url: 'rest/restorani',
				success: function(restorani){				
					$("#tabelaRestorana tbody tr").remove();
					$('div.divParent').hide();
					$('div#tabelaVozilaDiv').hide();
					$('div#tabelaKorisnikaDiv').hide();
					$('div#tabelaArtikalaDiv').hide();
					$('div#mojaStranicaDiv').hide();
					$('div#izlistajPrudzbineAdminDiv').hide();
					$('div#mojaKorpaDiv').hide();
					$('div#artikliPorudzbineDiv').hide();
					$('div#tremutmaPrudzbinaDiv').hide();
					$('div#izlistajPorudzbineDDiv').hide();
					$('div#artikliPorudzbineDDiv').hide();
					$("#tabelaArtikalaPrethodnihPorudzbinaDiv").hide();
					$('div#tabelaRestoranaDiv').show();
					var listaRestorana=[];
					var lista2=[];
					
					for(j=0; j<restorani.length; j++){
						if(restorani[j].isDeleted!=true){
							listaRestorana.push(restorani[j]);
						}
					}
									
					if(nameOrAddress!=""){
						var g;
						for(g=0; g<listaRestorana.length; g++){
							if(listaRestorana[g].naziv.includes(nameOrAddress)){
								lista2.push(listaRestorana[g]);
							}
						}
						listaRestorana=lista2;
						lista2=[];
					}
					
					if(type!="Bilo Kakva"){
						var h;
						for(h=0; h<listaRestorana.length; h++){
							if(listaRestorana[h].kategorija==type){
								lista2.push(listaRestorana[h]);	
							}
						}
						listaRestorana=lista2;
						lista2=[];
					}
					
					if(adresa!=""){
						var x;
						for(x=0; x<listaRestorana.length; x++){
							if(listaRestorana[x].adresa.includes(adresa)){
								lista2.push(listaRestorana[x]);
							}
						}
						listaRestorana=lista2;
						lista2=[];
					}
					
					var q;
					for(q=0; q<listaRestorana.length; q++){
						addRestoranTr(listaRestorana[q]);
					}
										
				}
			});					
		}else if(document.getElementById('artikalRadio').checked){
			$.get({
				url: 'rest/artikli',
				success: function(artikli){				
					var i;
					var lista2=[];
					$("#tabelaArtikala tbody tr").remove();
					$("#tabelaArtikalaP tbody tr").remove();
					$('div.divParent').hide();
					$('div#tabelaRestoranaDiv').hide();
					$('div#tabelaVozilaDiv').hide();
					$('div#tabelaKorisnikaDiv').hide();
					$('div#mojaStranicaDiv').hide();
					$('div#mojaKorpaDiv').hide();
					$('div#artikliPorudzbineDiv').hide();
					$('div#izlistajPrudzbineAdminDiv').hide();
					$('div#tremutmaPrudzbinaDiv').hide();
					$('div#izlistajPorudzbineDDiv').hide();
					$('div#artikliPorudzbineDDiv').hide();
					$("#tabelaArtikalaPrethodnihPorudzbinaDiv").hide();
					$('div#tabelaArtikalaDiv').show();
					for(i=0; i<artikli.length; i++){
						if(artikli[i].isDeleted!=true){
							listaArtikala.push(artikli[i]);
						}
					}
					
					if(nameOrAddress!=""){
						var j;
						for(j=0; j<listaArtikala.length; j++){
							if(listaArtikala[j].naziv.includes(nameOrAddress)){
								lista2.push(listaArtikala[j]);
							}
						}
						listaArtikala=lista2;
						lista2=[];
					}
					
					if(typeA!="Bilo Koji"){
						var h;
						for(h=0; h<listaArtikala.length; h++){
							if(listaArtikala[h].tip==typeA){
								lista2.push(listaArtikala[h]);	
							}
						}
						listaArtikala=lista2;
						lista2=[];
					}
					
					if(price!=""){
						var g;
						var pravaPrice=parseInt(price);
						for(g=0; g<listaArtikala.length; g++){
							if(document.getElementById('r11').checked){
								if(listaArtikala[g].cena==pravaPrice){
									lista2.push(listaArtikala[g]);	
								}
							}else if(document.getElementById('r9').checked){
								if(listaArtikala[g].cena<pravaPrice){
									lista2.push(listaArtikala[g]);	
								}
							}
							else if(document.getElementById('r7').checked){
								if(listaArtikala[g].cena>pravaPrice){
									lista2.push(listaArtikala[g]);	
								}
							}
						}
						listaArtikala=lista2;
						lista2=[];
					}
					
					if(restaurant!=""){
						$.get({
							url: 'rest/restorani',
							success: function(restorani){				
								var i;	
								for(i=0; i<restorani.length; i++){
									if(restorani[i].naziv.includes(restaurant)){
										listaR.push(restorani[i]);
									}
								}
								var f, a;
								for(f=0; f<listaR.length; f++){
									for(a=0; a<listaArtikala.length; a++){
										if(listaArtikala[a].idRestorana==listaR[f].id && listaR[f].isDeleted!=true){
											lista2.push(listaArtikala[a]);
										}
									}	
								}

								listaArtikala=lista2;
								lista2=[];
								
								var q;
								for(q=0; q<listaArtikala.length; q++){
									addArtikalTr(listaArtikala[q]);
								}
							}
						});	
					}else{	
						$.get({
							url: 'rest/restorani',
							success: function(restorani){
								var i;	
								for(i=0; i<restorani.length; i++){							
										listaR.push(restorani[i]);								
								}
								var q, z;
								for(z=0; z<listaR.length; z++){
									for(q=0; q<listaArtikala.length; q++){
										if(listaArtikala[q].idRestorana==listaR[z].id && listaR[z].isDeleted!=true){
											addArtikalTr(listaArtikala[q]);
										}
									}
								}
							}
						});
					}
				}
				
			});		
		}
	});	
});