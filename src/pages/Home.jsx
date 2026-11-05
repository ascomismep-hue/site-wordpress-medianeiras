                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/90">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{casasMissao[indiceCarrosselCasas].endereco}</span>
                  </p>
                  {casasMissao[indiceCarrosselCasas].telefone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span className="font-semibold">{casasMissao[indiceCarrosselCasas].telefone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO: 3 ÚLTIMAS NOTÍCIAS EM DESTAQUE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Avisos e Comunicados</span>
            <h2 className="font-serif text-3xl font-bold text-[#005a8d]">Últimas Notícias</h2>
          </div>
          <Link to="/noticias" className="text-xs font-bold text-[#005a8d] hover:underline flex items-center gap-1">
            Ver Todas as Notícias <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingNoticias ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
        ) : noticiasHome.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma notícia publicada no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {noticiasHome.map((item) => {
              const dataFormatada = new Date(item.data_publicacao + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
                  <div>
                    {item.foto_url && (
                      <div className="h-52 w-full overflow-hidden bg-gray-100">
                        <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                        <Calendar className="w-3.5 h-3.5" /> {dataFormatada}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#005a8d] line-clamp-2">{item.titulo}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{item.subtitulo || item.conteudo}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link to={`/noticias/${item.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#005a8d] hover:text-[#c5a059] transition-colors">
                      Confira &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SEÇÃO DE PRÓXIMOS EVENTOS E AGENDA */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Acompanhe a Congregação</span>
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Próximos Eventos e Agenda</h2>
            </div>
            <Link to="/agenda" className="flex items-center gap-2 bg-[#005a8d]/10 text-[#005a8d] hover:bg-[#005a8d] hover:text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all">
              Ver Agenda Completa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEventos ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : eventosHome.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center text-gray-500 shadow-sm">
              Nenhum evento futuro cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosHome.map((evento) => {
                const eDaSemana = isSemanaAtual(evento.data_evento);
                const dataFormatada = new Date(evento.data_evento + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                });

                return (
                  <div key={evento.id} className={`bg-gray-50 p-7 rounded-3xl shadow-sm border transition-all flex flex-col justify-between ${eDaSemana ? "border-[#c5a059] ring-2 ring-[#c5a059]/20 bg-white" : "border-gray-200"}`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${eDaSemana ? "bg-[#c5a059] text-white" : "bg-[#005a8d]/10 text-[#005a8d]"}`}>
                          {eDaSemana ? "✨ Esta Semana" : dataFormatada}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {evento.tipo === 'madre' ? 'Agenda da Madre' : 'Geral'}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-2">{evento.titulo}</h3>
                      
                      <div className="space-y-1 mb-4 text-xs text-gray-500 font-medium">
                        <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> {dataFormatada}</p>
                        {evento.horario && <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#c5a059]" /> {evento.horario}</p>}
                        {evento.local && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {evento.local}</p>}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{evento.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
