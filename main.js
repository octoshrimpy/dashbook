let data = {
    "worlds": {
        "a": {
            "cities": {
                "deiro":{},
                "fholm":{},
                "pitwell":{}
            }
        },
        "b": {
            "cities": {
                "westfield":{},
                "thampton":{},
                "ottle":{}
            }
        }
    }
}

function loadData () {
    // get data from browserstorage

    return data;
}

function searchFor (item) {
    console.log(item)
    return item
}

function search () {
    let searchTerm = searchbar.value
    let item = searchFor(searchTerm)
}

let searchbar = document.querySelector("input.bar")
searchbar.addEventListener("onchange", search );
