// Root data, extracted from Shadowrun 5 rulebook
const metaTypes = { elf : 'Elf/in', hum : 'Mensch/in', orc : 'Ork/in', tro : 'Troll/in', dwa : 'Zwerg/in' }
const lifeStyles = { str: 'Strasse', squ: 'Squatter', sub: 'Unterschicht', mid: 'Mittelschicht', top: 'Oberschicht', lux: 'Luxus' }
const archTypes = { adp : 'Adept/in', mag: 'Kampfmagier/in', dec: 'Decker/in', spec: 'SpecOps', mer: 'Unterhändler/in', rig: 'Rigger/in', ssa: 'Strassensamurai', ssh: 'Strassenschamane/in', tec: 'Technomancer/in', wea: 'Waffenspecialist/in' }
const [mareMin, mareMax] = [0, 10]

// Get me my dom references!
const domFields = {
    txtName : document.getElementById('cName'),
    selMeta : document.getElementById('cMetatype'),
    selLife : document.getElementById('cLifestyle'),
    selArch : document.getElementById('cArchtype'),
    ranMaRe : document.getElementById('cMageRes'),
    btnSave : document.getElementById('btnSave'),
    rowChar : document.getElementById('rowCharacters'),
    srtAlUp : document.getElementById('sortAlUp'),
    srtAlDw : document.getElementById('sortAlDw'),
    srtMaUp : document.getElementById('sortMaUp'),
    srtMaDw : document.getElementById('sortMaDw'),
}

// Class for Chars
class Character{
    static MAX_MARE = 5;
    static MIN_MARE = 1;
    constructor({name, meta, life, arch, mare}) {
        this.name = name
        this.meta = meta
        this.life = life
        this.arch = arch
        this.mare = mare
    }

    /**
     * Nicely formatted for your comfort!
     *
     * @returns {string}
     */
    getCardString(){
        return `<div class="col-md-6 mb-4">
          <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">${this.name}</h5>
              </div>
              <ul class="list-group list-group-flush">
                  <li class="list-group-item">${metaTypes[this.meta]}</li>
                  <li class="list-group-item">${lifeStyles[this.life]}</li>
                  <li class="list-group-item">${archTypes[this.arch]}</li>
              </ul>
              <div class="card-footer">
                  Res <-> Mage<br>
                  <input type="range" class="form-range" min="0" max="10" disabled value="${this.mare}">
              </div>
          </div>
      </div>`
    }

    static validate({name, meta, life, arch, mare}) {
        // Control if those are valid
        return name !== '' && meta !== '' && life !== '' && arch !== '' && mare >= this.MIN_MARE && mare <= this.MAX_MARE;
    }
}

const buildCharacterListFromLocalStorage = () => {
    const persistedCharacters = JSON.parse(localStorage.getItem('characters'));

    if(!persistedCharacters) return undefined;

    return persistedCharacters.map(char => new Character(char));
}

// Container for the Chars
const characterList = buildCharacterListFromLocalStorage() || [];

// Take my string, give me a node
const createElemFromString = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

// Fill all the elements as option into the el-node
const setSelectOptions = (el, elems) => {
    Object.keys(elems).forEach(val => el.appendChild(createElemFromString(`<option value="${val}">${elems[val]}</option>`)))
}

const clearForm = () => {
    domFields.txtName.value = ''
    domFields.selMeta.value = ''
    domFields.selLife.value = ''
    domFields.selArch.value = ''
    domFields.ranMaRe.value = Math.ceil((mareMin + mareMax) / 2)
}

// Fill the form options
setSelectOptions(domFields.selMeta, metaTypes)
setSelectOptions(domFields.selLife, lifeStyles)
setSelectOptions(domFields.selArch, archTypes)
domFields.ranMaRe.min = mareMin
domFields.ranMaRe.max = mareMax

// Fill the list! (clear it first)
const fillCharList = () => {
    // All the characters should be displayd in the according section
    domFields.rowChar.innerHTML = ''

    characterList.forEach(char => {
        domFields.rowChar.appendChild(createElemFromString(char.getCardString()));
    });
}


const saveToLocalStorage = () => {
    localStorage.setItem('characters', JSON.stringify(characterList));
}

// Interactivity
domFields.btnSave.addEventListener('click', () => {
    // Collect the values from the form
    const name = domFields.txtName.value;
    const meta = domFields.selMeta.value;
    const life = domFields.selLife.value;
    const arch = domFields.selArch.value;
    const mare = domFields.ranMaRe.value;

    // validate the values
    if(name === '' || meta === '' || life === '' || arch === ''){
        alert('Please fill out all the fields!');
        return;
    }

    // create a new object and add it to the list
    const newChar = new Character({name, meta, life, arch, mare});
    if(!Character.validate(newChar)){
        alert('Character invalid! ' + newChar);
        return;
    }
    characterList.push(newChar);

    // rerender the dom to show my list
    fillCharList();
    saveToLocalStorage();

    // clear the form for next input
    clearForm();
});

// Sort the list
const sortNameDesc = () => {
    characterList.sort((a, b) => b.name.localeCompare(a.name));
}

const sortNameAsc = () => {
    characterList.sort((a, b) => a.name.localeCompare(b.name));
}

const sortMageDesc = () => {
    characterList.sort((a, b) => b.mare - a.mare);
}

const sortMageAsc = () => {
    characterList.sort((a, b) => a.mare - b.mare);
}

// On Button Click
domFields.srtAlUp.addEventListener('click', () => {
    localStorage.setItem('sort', 'name_asc');
    sortNameAsc();
    fillCharList();
});

domFields.srtAlDw.addEventListener('click', () => {
    localStorage.setItem('sort', 'name_desc');
    sortNameDesc();
    fillCharList();
});

domFields.srtMaUp.addEventListener('click', () => {
    localStorage.setItem('sort', 'mage_asc');
    sortMageAsc();
    fillCharList();
});

domFields.srtMaDw.addEventListener('click', () => {
    localStorage.setItem('sort', 'mage_desc');
    sortMageDesc();
    fillCharList();
});

// On Reload
document.addEventListener('DOMContentLoaded', () => {
    const sort = localStorage.getItem('sort');
    if(sort){
        switch(sort){
            case 'name_asc':
                sortNameAsc();
                break;
            case 'name_desc':
                sortNameDesc();
                break;
            case 'mage_asc':
                sortMageAsc();
                break;
            case 'mage_desc':
                sortMageDesc();
                break;
        }
        fillCharList();
    } else {
        fillCharList();
    }
});

