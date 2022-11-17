<template>
  <div class="main container-md">
    <h2>Assembly page</h2>
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button class="nav-link active" id="assemble-tab" data-bs-toggle="tab" data-bs-target="#assemble" type="button" role="tab" aria-controls="assemble" aria-selected="true">Assemble</button>
        <button class="nav-link" id="modify-tab" data-bs-toggle="tab" data-bs-target="#modify" type="button" role="tab" aria-controls="modify" aria-selected="false">Modify</button>
        <button class="nav-link" id="newBlueprint-tab" data-bs-toggle="tab" data-bs-target="#newBlueprint" type="button" role="tab" aria-controls="newBlueprint" aria-selected="false">Create</button>
      </div>
    </nav>
    <div class="tab-content border border-top-0" id="nav-tabContent">
      <div class="tab-pane fade show active" id="assemble" role="tabpanel" aria-labelledby="assemble-tab">
        <form>
          <div class="mb-3">
            <label for="car-selector">Select <span class="text-info"><i class="fa fa-book"></i> blueprint</span> to assemble the <span class="text-info"><i class="fa fa-car"></i> car</span></label>
            <select id="car-selector" class="form-select" @change="setAssemblyId">
              <option selected disabled>Blueprints...</option>
              <option v-for="(bp, index) in blueprints" :key="index" :value="bp._id">{{bp.name}}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="car-selector">Amount of the cars</label>
            <div class="input-group mb-3">
              <button class="input-group-text btn-success" @click="setValue($event, 'numberOfCars', 1)"><i class="fa fa-fw fa-plus" aria-hidden="true"></i></button>
              <button class="input-group-text btn-danger" @click="setValue($event, 'numberOfCars', -1)"><i class="fa fa-fw fa-minus" aria-hidden="true"></i></button>
              <input type="text" class="form-control" :value="assemblyTarget.number" disabled>
            </div>
          </div>
          <label for="form-select">Can assemble the car: <span v-bind:class="(canAssemble ? 'text-success' : 'text-danger')">{{canAssemble}}</span></label>
          <button class="btn btn-success w-100" :disabled="!canAssemble">Assemble</button>
        </form>
      </div>
      <div class="tab-pane fade" id="modify" role="tabpanel" aria-labelledby="modify-tab">
        <div class="mb-2">
          <label for="bp-selector">Select a <span class="text-info"><i class="fa fa-book"></i> blueprint</span></label>
          <select id="bp-selector" class="form-select" @change="openModifyMenu">
            <option value="0" selected disabled>Blueprints...</option>
            <option v-for="(bp, index) in blueprints" :key="index" :value="bp._id">[{{shortId(bp._id)}}] {{bp.name}}</option>
          </select>
        </div>
        <form v-if="modifyTarget._id">
          <div class="mb-2">
            <label for="bp-name">Name</label>
            <input id="bp-name" class="form-control" :value="modifyTarget.name" @change="setValue($event, 'modify_name')" />
          </div>
          <div class="mb-2">
            <label for="bp-name">Number of items</label>
            <div class="input-group mb-3">
              <button class="input-group-text btn-success" @click="modify_addToArray"><i class="fa fa-fw fa-plus" aria-hidden="true"></i></button>
              <button class="input-group-text btn-danger" @click="modify_removeFromArray"><i class="fa fa-fw fa-minus" aria-hidden="true"></i></button>
              <input id="bp-items" class="form-control" :value="modifyTarget.items.length" disabled />
            </div>
          </div>
          <div class="mb-2" v-for="(item, index) in modifyTarget.items" :key="index">
            <label for="bp-name">
              Item {{index}}
              <button class="btn btn-sm btn-outline-danger py-0" @click="modify_removeFromArray($event, index)">
                <i class="fa fa-trash-o"></i> Delete
              </button>
            </label>
            <div class="row">
              <div class="col-6">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">ID:</span>
                  <input type="text" class="form-control" :value="item.id" @change="setArrayValue($event, 'modify_id', index)">
                </div>
              </div>
              <div class="col-6">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">Amount:</span>
                  <input type="text" class="form-control" :value="item.amount" @change="setArrayValue($event, 'modify_amount', index)">
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-warning w-100 mt-3" @click="modify">Submit changes</button>
        </form>
      </div>
      <div class="tab-pane fade" id="newBlueprint" role="tabpanel" aria-labelledby="newBlueprint-tab">
        <form>
          <div class="mb-2">
            <label for="bp-name">Name for a <span class="text-info"><i class="fa fa-book"></i> blueprint</span></label>
            <input id="bp-name" class="form-control" :value="newTarget.name" @change="setValue($event, 'new_name')" placeholder="Car..." />
          </div>
          <div class="mb-2">
            <label for="bp-name">Number of items</label>
            <div class="input-group mb-3">
              <button class="input-group-text btn-success" @click="new_addToArray"><i class="fa fa-fw fa-plus" aria-hidden="true"></i></button>
              <button class="input-group-text btn-danger" @click="new_removeFromArray"><i class="fa fa-fw fa-minus" aria-hidden="true"></i></button>
              <input id="bp-items" class="form-control" :value="newItems.length" disabled />
            </div>
          </div>
          <div class="mb-2" v-for="(item, index) in newItems" :key="index">
            <label for="bp-name">
              Item {{index}}
              <button class="btn btn-sm btn-outline-danger py-0" @click="deleteItem($event, index)">
                <i class="fa fa-trash-o"></i> Delete
              </button>
            </label>
            <div class="row">
              <div class="col-6">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">ID:</span>
                  <input type="text" class="form-control" :value="item.id" @change="setArrayValue($event, 'new_id', index)">
                </div>
              </div>
              <div class="col-6">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">Amount:</span>
                  <input type="text" class="form-control" v-model="item.amount" @change="setArrayValue($event, 'new_amount', index)">
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-success w-100 mt-3" @click="create">Create blueprint</button>
        </form>
      </div>
    </div>

    <div class="accordion pt-4" id="blueprints">
      <div class="accordion-item" v-for="(item, index) in blueprints" :key="'acc-'+index">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#bp-'+index">
            <span v-bind:class="'badge bg-'+(isEveryItemAvailable(item.items) ? 'success' : 'danger')">
              <i v-bind:class="'fa fa-fw fa-'+(isEveryItemAvailable(item.items) ? 'check' : 'close')" aria-hidden="true"></i>
            </span>
            &nbsp; {{item.name}}
          </button>
        </h2>
        <div :id="'bp-'+index" class="accordion-collapse collapse p-3" data-bs-parent="#blueprints">
          <p class="mb-0">
            <b>Name:</b> {{item.name}} <br>
            <b>id:</b> {{item._id}} <br>
            <b>Actions:</b>
              <button class="ms-2 badge border-0 bg-danger" @click="removeBlueprint($event, item._id)">
                <i class="fa fa-trash" aria-hidden="true"></i> Delete
              </button>
            <br>
            <b>Items required:</b>
          </p>
          <button data-bs-toggle="modal" data-bs-target="#modal" v-bind:class="'border-0 me-1 badge bg-'+(isAvailable(i.id, i.amount) ? 'success' : 'danger')" v-for="(i, index) in item.items" :key="'i'+index" @click="showItemModal(i.id, i.amount)">{{i.amount}}pcs. - {{i.id}}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade text-start" id="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Item information</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            <b>ItemId:</b> {{modal._id}} <br>
            <b>Name:</b> {{modal.name}} <br>
            <b>Amount in storage:</b> {{modal.amount}}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div id="alert" class="new-alert">
    <p id="alert_msg"></p>
  </div>
</template>



<script>
import BlueprintService from '../services/BlueprintService.js'
import ItemService from '../services/ItemService.js'

export default {
  name: 'AssemblyPage',
  data() {
    return {
      items: [],
      blueprints: [],
      canAssemble: false,
      assemblyTarget: {id:'', number: 1},
      modifyTarget: {name:'', items:[]},
      newTarget: {name:'', items: []},
      newName: '',
      newItems: [],
      modal: {_id: '(empty)', name: '(not-found)', amount: ''},
    }
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.blueprints = await BlueprintService.load();
      this.items = await ItemService.load();
    },
    showItemModal(itemId, itemAmount) {
      let target = this.items.find(a => a._id == itemId) || {_id: itemId, name: '(not-found)', amount: 0};
      this.modal = {_id: target._id, name: target.name, amount: `${target.amount}/${itemAmount}`};
    },
    findNameById(itemId) {
      return this.items.find(a => a._id == itemId).name || itemId;
    },
    isEveryItemAvailable(items, multiplier=1) {
      return items.every(i => this.isAvailable(i.id, i.amount*multiplier));
    },
    isAvailable(itemId, itemAmount) {
      let index = this.items.findIndex(a => a._id == itemId);
      return (index > -1) && (this.items[index].amount >= itemAmount);
    },
    shortId(id) {
      return '*' + id.substr(id.length - 5);
    },
    setValue(e, target, value=event.target.value) {
      e.preventDefault();
      switch (target) {
        case 'new_name':      this.newTarget.name = value; break;
        case 'modify_name':   this.modifyTarget.name = value; break;
        case 'numberOfCars':  if (value > 0) this.assemblyTarget.number += 1;
                              else this.assemblyTarget.number -= (this.assemblyTarget.number > 1 ? 1 : 0);
                              this.assembleCheck();
      }
    },
    setArrayValue(e, target, index) {
      e.preventDefault();
      let res = e.target.value;
      switch (target) {
        case 'new_id':        this.newItems[index].id = res; break;
        case 'new_amount':    this.newItems[index].amount = res; break;
        case 'modify_id':     this.modifyTarget.items[index].id = res; break;
        case 'modify_amount': this.modifyTarget.items[index].amount = res; break;
      }
    },
    new_addToArray(e) {
      e.preventDefault();
      this.newItems.push({id: '', amount: 0});
    },
    new_removeFromArray(e) {
      e.preventDefault();
      if (this.newItems.length > 1) this.newItems.pop();
    },
    openModifyMenu(e) {
      let id = e.target.value;
      let target = this.blueprints.find(a => a._id == id) || {};
      this.modifyTarget = JSON.parse(JSON.stringify(target));
    },
    modify_addToArray(e) {
      e.preventDefault();
      this.modifyTarget.items.push({id: '', amount: 0});
    },
    modify_removeFromArray(e) {
      e.preventDefault();
      if (this.modifyTarget.items.length > 1) this.modifyTarget.items.pop();
    },
    setAssemblyId(e) {
      this.assemblyTarget.id = e.target.value;
      this.assembleCheck()
    },
    assembleCheck() {
      let index = this.blueprints.findIndex(a => a._id == this.assemblyTarget.id)
      if (index > -1) {
        let target = this.blueprints[index].items;
        this.canAssemble = this.isEveryItemAvailable(target, this.assemblyTarget.number);
      } else this.canAssemble = false;
    },
    async removeBlueprint(e, id) {
      e.preventDefault();
      await BlueprintService.delete(id);
      this.load();
    },
    async showAlert(status,msg) {
      let alert = document.getElementById('alert');
      let alert_msg = document.getElementById('alert_msg');
      alert_msg.innerHTML = `<i class="fa fa-fw ${ status == 'ok' ? 'fa-check' : 'fa-exclamation-triangle' }" aria-hidden="true"></i> ${msg}`;
      alert.style.backgroundColor = (status == 'ok' ? '#d4edda' : '#f8d7da');
      alert.classList.add('animate');
      setTimeout(() => {
        alert.classList.remove('animate');
      }, 10000);
    },
    async modify(e) {
      e.preventDefault();
      let target = this.modifyTarget;
      let result = await BlueprintService.modify(target._id, target.name, target.items);
      if (result.status && result.status == 200) {
        this.showAlert('ok', 'Blueprint modified successfully!');
        document.getElementById('bp-selector').value = '0';
        this.modifyTarget = {name:'', items:[]};
        this.load();
      }
      else this.showAlert('error', result);
    },
    async create(e) {
      e.preventDefault();
      let result = await BlueprintService.insert(this.newTarget.name, this.newItems);
      if (result.status && result.status == 201) {
        this.showAlert('ok', 'Blueprint created successfully!');
        this.newTarget = {name:'', items:[]};
        this.load();
      }
      else this.showAlert('error', result);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main { text-align: start; }
.tab-pane { padding: 20px; }
.btn { font-weight: bold; }

.new-alert {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  margin: 10px;
  padding: 10px;
  max-width: 100%;
  min-height: 60px;
  text-align: start;
  border: 1px solid gray;
  border-radius: 0.25rem;
}

.animate {
  display: block;
  animation: forwards;
  animation-duration: 0.5s;
  animation-name: slidein;
}

@keyframes slidein {
    from { right: -100%; }
    to { right: 0; }
  }

</style>
