<template>
    <div>
        <div class="masthead">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h1 class="font-weight-light">Welcome to the world of advanced technology</h1>
                        <p class="pt-2 mb-5">
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                        <div class="mb-4">
                            <button class="btn btn-light mr-3">Learn More</button>
                            <button class="btn btn-light">Example</button>
                        </div>

                    </div>
                    <div class="col-md-6">
                        <img class="img-fluid" src="../assets/img-head.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="theread">
                <h2 class="text-center">What is Read 4IT</h2>
                <div class="row">
                    <div class="col-md-3">
                        <div class="advance mb-5">
                            <h4 class="mb-3">Advance OCR</h4>
                            <p>
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <div class="secure">
                            <h4 class="mb-3">Fast and Secure</h4>
                            <p>
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <img class="img-fluid" src="../assets/img-read.png" alt="">

                    </div>
                    <div class="col-md-3">
                        <div class="use mb-5">
                            <h4 class="mb-3">Easy to use</h4>
                            <p>
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <div class="friendly">
                            <h4 class="mb-3">User Friendly</h4>
                            <p>
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style>
    *{
        font-family: 'Roboto', sans-serif;
    }
    .masthead{
        /*background: rgb(47, 46, 65);*/
        color: white;
        padding: 80px 0 80px 0;
    }
    .theread{
        padding: 80px 0 80px 0;
        color: rgb(47, 46, 65);
        margin-top: -190px;
    }
    .theread h2{
        margin-bottom: 100px !important;
    }
    .masthead{
        background: url("../assets/bg-img.png");
        height: 880px;
    }

</style>
