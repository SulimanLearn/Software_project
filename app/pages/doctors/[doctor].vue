<template>
    <div>
        <NavBar />
        <h1>{{ doctor.name }}</h1>
    </div>
</template>

<script setup>
    const route = useRoute()

    const doctor = computed(() => {
        return {
            name: route.params.doctor
        }
    })
</script>