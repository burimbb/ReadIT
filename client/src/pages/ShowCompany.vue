<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 mt-5">
                <div class="form-group">
                    <label>First Select a Company</label>
                    <input type="text" disabled class="form-control" :value="company.name">
                    <div class="input-group mt-3">
                        <div class="custom-file">
                            <input type="file" ref="file" class="custom-file-input" id="attachmentsgroup" @change="handleFileUpload" accept="image/x-png,image/gif,image/jpeg">
                            <label class="custom-file-label" for="attachmentsgroup" v-text="choseFileLabel"></label>
                        </div>
                        <div class="input-group-append">
                            <button class="btn btn-outline-danger" type="button" id="inputGroupFileAddon04" @click="clearImages()">Clear</button>
                        </div>
                    </div>
                </div>
                <div v-show="browseFile" class="text-right">
                    <button class="btn btn-primary" @click="submitFile()">Upload</button>
                </div>
                <div v-if="addNewLabel && editingLabel == -1">
                    <div class="form-group mt-5">
                        <label for="name">Label:</label>
                        <input type="text" id="name" v-model="newLabel" class="form-control"/>
                        <swatches-picker class="mt-3 w-100" v-model="colorPalete"></swatches-picker>
                        <div class="text-right">
                            <button class="btn btn-primary mt-3 mr-2" @click="cancelAddLabel()">Cancel</button>
                            <button class="btn btn-primary mt-3" @click="addLabel()">Add Label</button>
                        </div>
                    </div>
                </div>
                <div class="my-5" v-if="!addNewLabel || editingLabel != -1">
                    <p class="font-weight-bold" v-if="company.labels.length">Label Name:</p>
                    <div v-for="(label, index) in company.labels" :key="index">
                        <edit-label 
                            :data="label" 
                            :index="index"
                            :selectedLabelId="selectedLabel != null ? selectedLabel._id : null"
                            :isEditing="editingLabel == index"
                            @update-label="updateLabel($event)"
                            @editing-label="editingLabel = $event"
                            @cancel-update="cancelUpdateLabel()"
                            @selected-label="selectLabel($event)"
                            @removed-label="removeLabel($event)"
                        ></edit-label>
                    </div>

                    <hr>
                    <div class="d-flex justify-content-between mt-5">
                        <button class="btn btn-primary text-white" @click="showAllLabels()" :disabled="!company.labels.length">Show All Labels</button>
                        <button class="btn btn-primary text-white" :disabled="!labelsUpdated" @click="saveLabels()">Save Labels</button>
                    </div>
                </div>
            </div>
            <div>
                <canvas class="shadow m-5"  id="canvas" width="650" height="920"></canvas>
            </div>
        </div>
    </div>

</template>

<script>
import EditLabel from '../components/company/EditLabel.vue'
import {Swatches} from "vue-color";

export default {
    name: "ShowCompany",
    components: {
        'swatches-picker': Swatches,
        EditLabel
    },
    data(){
        return {
            file: '',
            browseFile: false,
            company: {
                name: '',
                labels: []
            },

            rect : {
                startX:0,
                startY:0,
                w:0,
                h:0,
            },

            drag : false,
            imageObj : null,
            ctx: null,
            canvas:null,

            addNewLabel: false,
            newLabel:'',
            labelsUpdated: false,

            color: '',
            colorPalete: [],

            showDropdownBtn: false,
            showDropdown: false,

            choseFileLabel: "Choose file",

            editingLabel: -1,
            selectedLabel: null,
            editLabelName: '',
        }
    },

    methods: {
        fetchCompany(){
            this.axios.get('/companies/' +this.$route.params.id)
                .then(res => {
                    this.company = res.data.data
                    this.init()
                    }
                ).catch(() => {

                });
        },
        handleFileUpload(event){
            this.file = this.$refs.file.files[0]

            if(event.target.files.length > 1){
                this.choseFileLabel = "Selected "+event.target.files.length+" images"
            }else{
                this.choseFileLabel = event.target.files[0].name
            }
            this.browseFile = true

        },

        submitFile(){
            let formData = new FormData();
            formData.append('files', this.file);
            formData.append('companyId', this.company._id);

            this.axios.post('/upload/train', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(res=>{
                this.company = res.data
                this.showDropdownBtn = true

                this.init()
            }).catch(e=>{
                console.log(e)

                console.log('FAILURE!!')
            });
        },

        init() {
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.imageObj = new Image();
            this.imageObj.src = `http://localhost:3000/trained/${this.company.filename}`;
            this.imageObj.onload =  () => { this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height ) };
            this.canvas.addEventListener('mousedown', this.mouseDown, false);
            this.canvas.addEventListener('mouseup', this.mouseUp, false);
            this.canvas.addEventListener('mousemove', this.mouseMove, false);
        },

        mouseDown(e) {
            this.rect.startX = e.pageX - this.canvas.offsetLeft;
            this.rect.startY = e.pageY - this.canvas.offsetTop;
            this.drag = true;
        },

        mouseUp() {
            this.drag = false;
            this.addNewLabel = true;
        },

        mouseMove(e) {
            if (this.drag) {
                this.ctx.clearRect(0, 0, 650, 920);
                this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height );
                this.rect.w = (e.pageX - this.canvas.offsetLeft) - this.rect.startX;
                this.rect.h = (e.pageY - this.canvas.offsetTop) - this.rect.startY;
                this.ctx.lineWidth = "4";
                this.ctx.strokeStyle = '#64eb34';
                this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
            }
        },

        addLabel(){
            if(this.newLabel != ''){
                if(!this.colorPalete.hex){
                    this.color = '#2F2E41';
                }else{
                    this.color = this.colorPalete.hex;
                }
                this.company.labels.push({
                    name: this.newLabel,
                    rect: { ...this.rect },
                    color: this.color
                })
                this.newLabel = '';
                this.addNewLabel = false;
                this.labelsUpdated = true;
            }else{
                window.alert('You have to name a label')
            }
        },

        cancelAddLabel(){
            this.newLabel = '';

            this.rect = {
                startX:0,
                startY:0,
                w:0,
                h:0,
            };
            this.addNewLabel = false;
            this.labelsUpdated = false;
            this.init();
        },

        saveLabels(){
            this.axios.put('/train/'+this.company._id, {
                name: this.company.name,
                companyId: this.company._id,
                labels: this.company.labels,
            })
                .then(res=>{
                    this.labelsUpdated = false;
                    console.log(res);

                }).catch(e=>{
                console.log(e);
                console.log('FAILURE!!');
            });
        },

        selectLabel(label, clearable = true){
            if(clearable){
                this.ctx.clearRect(0, 0, 650, 920);
                this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height);
            }
            this.ctx.lineWidth = "4";
            this.ctx.strokeStyle = label.color;
            this.ctx.strokeRect(label.rect.startX, label.rect.startY, label.rect.w, label.rect.h);

            this.selectedLabel = label;
            this.editingLabel = -1;
        },

        showAllLabels(){
            this.company.labels.forEach((label)=>{
                this.selectLabel(label, false);
            });
        },

        clearImages(){
            this.choseFileLabel = "Choose file"
        },

        cancelUpdateLabel(){
            this.selectedLabel = null;
            this.editingLabel = -1;
            this.init();
        },

        updateLabel(label){
            this.addNewLabel = false;
            if((this.rect.startX && this.rect.startY && this.rect.w && this.rect.h)) {
                label.rect = this.rect;
            }
            this.selectedLabel = null;
            this.editingLabel = -1;
            this.labelsUpdated = true;
        },

        removeLabel(index){
            console.log(this.company)
            this.company.labels.splice(index, 1);
            this.labelsUpdated = true;
            console.log(this.company)
        },
    },
    mounted() {
        this.fetchCompany()
    },
}
</script>
<style scoped>
    .btn-primary{
        background: rgb(47, 46, 65) !important;
        border-color: rgb(47, 46, 65) !important;
    }
    .btn-primary:focus{
        border-color: rgb(47, 46, 65) !important;
    }
    .pointer{
        cursor: pointer;
    }

    .custom-file-label{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
