<template>
    <div class="container">
        <div class="text">
            <h2>Companies</h2>
        </div>

        <div class="d-flex justify-content-center">
            <div class="w-75 text-right">
                <button type="button" class="btn btn-primary mb-3" @click="$modal.show('add-company')" >
                    <i class="fa fa-plus"></i>Add Companies
                </button>
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <table class="w-75  table table-bordered">
                <thead class="table-color">
                <tr>
                    <th class="text">#</th>
                    <th>Name</th>
                    <th class="text action-btn">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(company, index) in companies" :key="company.id">
                    <td class="text">{{index + 1}}</td>
                    <td>{{ company.name }}</td>
                    <td >
                        <div class="row " >
                            <div class="mx-auto">
                                <button class="btn btn-secondary mr-1 " @click="editCompany(company)">
                                    <i class="fa fa-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger " @click="deleteCompanies(company._id, index)" >
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <modal name="add-company">
            <div class="">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Add Company</h5>
                    <button @click="$modal.hide('add-company')" type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span  aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                    <div class="form-group">
                        <label for="companyname">Company Name</label>
                        <input type="email" id="companyname" class="form-control" v-model="name">
                    </div>
                </div>
                <div class="modal-footer justify-content-between m-3">
                    <button type="button" class="btn btn-secondary" @click="$modal.hide('add-company')">Close</button>
                    <button type="submit" class="btn btn-primary" @click="addCompany()">Save</button>
                </div>
            </div>
        </modal>

        <modal name="edit-company" height="auto" :scrollable="true">
            <div class="">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Company</h5>
                    <button @click="$modal.hide('edit-company')" type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span  aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                    <div class="form-group">
                        <label for="companyname">Company Name</label>
                        <input type="text"  class="form-control" v-model="editCompanyForm.name">
                    </div>
                    <div class="text-right">
                        <button class="btn btn-sm btn-primary"  @click="goTo(editCompanyForm._id)">Edit Labels</button>
                    </div>
                </div>
                <div class="modal-footer justify-content-between m-3">
                    <button type="button" class="btn btn-secondary" @click="$modal.hide('edit-company')">Close</button>
                    <button type="submit" class="btn btn-primary" @click="updateCompany()">Save</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    export default {
        name: "Companies",
        data(){
            return{
                name: '',
                companies: [],

                showEditLabel: false,

                editCompanyForm: {
                    name: '',
                    filename: '',
                    labels: []
                },
            }
        },
        mounted() {
            this.fetchCompany();
        },
        methods:{
            addCompany(){
                this.axios.post('/companies', {name: this.name})
                .then(res => {
                    this.name = ''
                    this.companies.push(res.data.company)
                    this.$modal.hide('add-company')
                })
                .catch(e => {
                    console.log(e)
                })
            },
            fetchCompany(){
                this.axios.get('/companies')
                    .then(res => {
                        this.companies = res.data.company
                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            editCompany(company){
                this.editCompanyForm = { ...company }
                this.$modal.show('edit-company')
            },
            updateCompany(){
                this.axios.put( '/train/'+this.editCompanyForm._id, this.editCompanyForm)
                    .then(() => {
                        this.$modal.hide('edit-company')
                        this.fetchCompany()
                    }).catch(e => {
                        console.log(e)
                    });
            },
            deleteCompanies (id, index){
                this.axios.delete('/companies/'+ id)
                    .then(() => {
                        this.companies.splice(index, 1)
                    }).catch(e => {
                        console.log(e)
                    });
            },
            goTo(id) {
                this.$router.push({ path: '/companies/' + id })
            },
        },


    }
</script>

<style scoped>
.btn-primary{
    background-color: rgb(47, 46, 65);
    border-color: rgb(47, 46, 65);
}
.text{
    text-align: center;
    margin-top: 5%;
}
.table-color{
    color: #fff;
    background-color: rgb(47, 46, 65);
    border-color: rgb(47, 46, 65);
}
.action-btn{
    width: 25%;
}
@media (max-width: 736px) {
    .action-btn{
        width: auto;

    }
}

</style>
