<template>
    <div>
        <div class="container align-items-center">
            <div class="row flex-column-reverse flex-md-row ">
                <div class="contact col-md-8 text-left">
                    <h3 class="mb-4">Contact Us</h3>
                    <p>Our Address : Cecilia Chapman
                        711-2880 Nulla St.
                        Mankato</p>
                    <p>Number: +133424244</p>
                    <p>Email: read4it@contact.us</p>
                    <p class="m-0">BEO © {{ new Date().getFullYear() }}</p>
                </div>
                <div class="col-md-4 text-center">
                    <img width="180" class="img-fluid" src="../assets/logo-footer.svg" alt="">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "FooterContent"
    }
</script>

<style scoped>
    @media (max-width: 768px) {
        .contact{
            text-align: center!important;
        }

    }

</style>
