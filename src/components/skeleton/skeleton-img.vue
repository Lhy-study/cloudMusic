<template>
    <div class="skeleton-img">
        <li v-for="i in 10" :key="i">
            <el-skeleton style="width: 32%" >
                <template #template>
                    <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
                    <div style="padding: 14px">
                        <el-skeleton-item variant="p" style="width: 50%" />
                    </div>
                </template>
            </el-skeleton>
        </li>
    </div>
</template>

<style lang="less" scoped>
.skeleton-img{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 1em;
}
</style>