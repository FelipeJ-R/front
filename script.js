//QUERIES

const input = document.querySelector("input")
const areaDosFilmes = document.querySelector(".movies")
const modal = document.querySelector(".modal")
const next = document.querySelector(".btn-next")
const prev = document.querySelector(".btn-prev")


// VARIÁVEIS E CONSTANTES
const pesquisaBase = "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
const pesquisaDigitada = "https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query="
let buscado = ""
let contador = 0
let idDoFilme = ""
let start = 0
let end = 5
let padrao = true
let preenchimento = []


// FUNÇÕES

const mostrarModal = () => {
    modal.classList.remove("hidden")
    preencherModal()
}

const filmeDoDia = () => {
    const buscaFilme = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`)
    buscaFilme.then(pesquisa => {
        const retorno = pesquisa.json()
        retorno.then(objetoLegivel => {
            document.querySelector(".highlight__video").style.backgroundImage = `url("${objetoLegivel.backdrop_path}")`
            document.querySelector(".highlight__video").style.backgroundSize = "cover"
            document.querySelector(".highlight__title").innerHTML = objetoLegivel.title
            document.querySelector(".highlight__rating").textContent = objetoLegivel.vote_average
            let genres = ""
            objetoLegivel.genres.forEach(element => {
                genres += element.name + " , "
            })
            document.querySelector(".highlight__genres").textContent = genres.slice(0, -3)
            document.querySelector(".highlight__launch").textContent = objetoLegivel.release_date
            document.querySelector(".highlight__description").textContent = objetoLegivel.overview
        })
    })
    const buscaVideo = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`)
    buscaVideo.then(pesquisa => {
        const retorno = pesquisa.json()
        retorno.then(objetoLegivel => {
            document.querySelector(".highlight__video-link").href = "https://www.youtube.com/watch?v=" + objetoLegivel.results[0].key
        })
    })
}

const preencherModal = () => {
    const busca = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDoFilme}?language=pt-BR`)
    busca.then(pesquisa => {
        const retorno = pesquisa.json()
        retorno.then(objetoLegivel => {
            document.querySelector(".modal__close").addEventListener("click", () => {
                modal.classList.add("hidden");
                document.querySelector(".modal__genres").innerHTML = ""
            })
            console.log(objetoLegivel)
            document.querySelector(".modal__img").src = objetoLegivel.backdrop_path
            document.querySelector(".modal__img").alt = objetoLegivel.title.toUpperCase()
            modal.querySelector(".modal__title").innerHTML = "" + objetoLegivel.title
            document.querySelector(".modal__description").textContent = "" + objetoLegivel.overview
            document.querySelector(".modal__average").textContent = "" + objetoLegivel.vote_average
            objetoLegivel.genres.forEach(element => {
                const genreSpan = document.createElement("span")
                genreSpan.classList.add("modal__genre")
                genreSpan.textContent = element.name
                document.querySelector(".modal__genres").append(genreSpan)
            })
        })
    })
}
const preenchedora = array => {
    array.slice(start, end).forEach(filme => {
        const cartaz = document.createElement("div")
        cartaz.classList.add("movie")
        !filme.poster_path ? cartaz.innerText = filme.title.toUpperCase() : cartaz.style.backgroundImage = `url("${filme.poster_path}")`
        areaDosFilmes.append(cartaz)
        const infoCartaz = document.createElement("div")
        infoCartaz.classList.add("movie__info")
        cartaz.append(infoCartaz)
        const titulo = document.createElement("span")
        titulo.classList.add("movie__title")
        titulo.textContent = filme.title
        infoCartaz.append(titulo)
        const pontuacao = document.createElement("span")
        pontuacao.classList.add("movie__rating")
        const estrela = document.createElement("img")
        estrela.src = "./assets/estrela.svg"
        pontuacao.textContent = filme.vote_average
        pontuacao.append(estrela)
        infoCartaz.append(pontuacao)
        cartaz.addEventListener("click", () => {
            idDoFilme = filme.id
            mostrarModal()
        })


    })
}
const buscadora = () => {
    contador = 0
    start = 0
    end = 5
    areaDosFilmes.innerHTML = ""
    !input.value ? buscado = pesquisaBase : buscado = pesquisaDigitada + input.value
    const busca = fetch(buscado)
    busca.then(pesquisa => {
        const retorno = pesquisa.json()
        retorno.then(objetoLegivel => {
            preenchimento = objetoLegivel.results
            preenchedora(preenchimento)
        })
    })
}

// EXECUÇÕES

buscadora()
input.addEventListener("keydown", element => {
    if (element.key === "Enter") {
        buscadora()
        input.value = ""
    }
})
filmeDoDia()

next.addEventListener("click", element => {
    areaDosFilmes.innerHTML = ""
    start += 5
    end += 5
    if (end >= preenchimento.length) {
        end = preenchimento.length
        let offset = 5
        preenchimento.length % 5 !== 0 ? offset = preenchimento.length % 5 : offset
        start = preenchimento.length - (offset)
        preenchedora(preenchimento)
        start = -5
        end = 0
    } else {
        preenchedora(preenchimento)
    }
})

prev.addEventListener("click", element => {
    areaDosFilmes.innerHTML = ""
    start -= 5
    end -= 5
    if (start < 0) {
        end = preenchimento.length
        let offset = 5
        preenchimento.length % 5 !== 0 ? offset = preenchimento.length % 5 : offset
        start = preenchimento.length - (offset)
        preenchedora(preenchimento)
        end = start + 5
    } else {
        preenchedora(preenchimento)
    }

})