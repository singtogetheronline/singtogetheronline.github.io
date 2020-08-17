import {getAllPerformers, createPerformer, savePerformer, deletePerformer} from '../../services/storage.js';

import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function Performers(props) {
  const [editingPerformer, setEditingPerformer] = useState(null);
  
  useEffect(() => {
    // this means they just arrived or they just finished editing a performer
    if (editingPerformer==null) { 
      getAllPerformers().then(results => props.setPerformers(results));
    }
  }, [editingPerformer]);

  function newPerformer() {
    $('#newPerformerModal').modal('show');
    const startData = {name:'Performer Name', email:'', otherEmail:''}
    createPerformer(startData).then(doc => {
      setEditingPerformer({...startData, id:doc.id});
    })
  }

  function save() {
    savePerformer(editingPerformer).then(() => {
      $('#newPerformerModal').modal('hide');
      setEditingPerformer(null);
    });
  }

  function removePerformer(performer) {
    deletePerformer(performer);
    props.setPerformers(props.performers.filter(p => p.id !== performer.id));
  }

  return html`
    <h3>Manage Performers</h3>
    <ul>
      ${props.performers.map(performer => html`
        <li><a href="#" onclick=${e => {
          $('#newPerformerModal').modal('show');
          setEditingPerformer(performer)
          }}
        >${performer.name}</a>
        <a href="#" onclick=${e=>removePerformer(performer)}> <i class="fas fa-trash-alt trash-icon"></i></a></li>`)}
      <li><a href="#" onclick=${e => newPerformer()}>Add New Performer</a></li>
    </ul>
    <div class="modal" tabindex="-1" role="dialog" id="newPerformerModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Performer Info</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
            ${editingPerformer && html`
              <div class="form-group">
                <label for="nameBox">Performer Name</label>
                <input
                  class="form-control"
                  id="nameBox"
                  value="${editingPerformer.name}"
                  onchange=${e => setEditingPerformer({...editingPerformer,name:e.target.value})}
                ></input>
              </div>
              <div class="form-group">
                <label for="emailBox">Email Address</label>
                <input
                  class="form-control"
                  id="emailBox"
                  value="${editingPerformer.email}"
                  onchange=${e => setEditingPerformer({...editingPerformer, email: e.target.value})}
                ></input>
              </div>
              <div class="form-group">
                <label for="otherEmailBox">Alternate Email Address</label>
                <input
                  class="form-control"
                  id="otherEmailBox"
                  value="${editingPerformer.otherEmail}"
                  onchange=${e => setEditingPerformer({...editingPerformer, otherEmail: e.target.value})}  
                ></input>
              </div>
              `}
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" onclick=${e=> save()}>Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    `;
} 