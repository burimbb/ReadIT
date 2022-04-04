<template>
    <div>
        <div class="container">
            <h2 class="text-center my-5">Documents</h2>
            <div class="text-center mt-5">
                <div v-if="loading" class="spinner-border spiner-document " style="width: 5rem; height: 5rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <p>All Documents: {{ meta.docs_count }}</p>

            <div class="row">
                <div v-for="document in documents" :key="document.id" class="col-lg-3 col-md-6 my-4 documents">
                    <img class="img-hover" width="300" height="400" :src="`http://localhost:3000/documents/${document.filename}`" @click="goTo(document._id)" alt="">
                </div>
            </div>
        </div>
        <div v-if="meta.last_page != 1" class="text-center">
            <button @click="getMoreDocuments" class="btn btn-primary mb-4 load-more">
                Load More
            </button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {

        name: "Documents",
        data(){
            return {
                documents : [],
                page: 1,
                meta: {
                    last_page: 0,
                    docs_count:'',
                },
                loading: true,
            }
        },
        methods:{
            loadDocuments(page = 1 ){
                axios.get('http://localhost:3000/documents?page=' +page).then(res => {
                        this.documents = res.data.docs;
                        this.meta = res.data.meta;
                        this.loading = false
                    }
                ).catch(() => {

                });

            },
            goTo(id) {
                this.$router.push({ path: '/documents/' + id })
            },
            getMoreDocuments(){
                this.page += 1;
                this.loadDocuments(this.page);
            }
        },
        mounted(){
            this.loadDocuments();
        },
    }
</script>

<style scoped>
    .load-more{
        width: 13%;
    }
    .documents img{
        box-shadow: 0 20px 20px rgba(0, 0, 0, 0.12);
        object-fit: contain;
        cursor: pointer;
    }
    .spiner-document{
        color: rgb(47, 46, 65) !important;
        margin-top: 200px;
        margin-bottom: 430px;
    }
    button:focus {
        outline:0 !important;
        box-shadow: none;
    }
    .btn-primary{
        color: #fff;
        background-color: rgb(47, 46, 65);
        border-color: rgb(47, 46, 65);
    }
    .img-hover {
        transition: transform ease-in 200ms;
    }
    .img-hover:hover{
        transform: scale(1.06);
    }
    @media (min-width: 320px) {
        .documents img{
            width: 100%;
        }
    }
    @media (max-width: 768px) {
        .load-more{
            width: 30%;
        }
    }

</style>
