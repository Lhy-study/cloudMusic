<template>
    <div id="skeleton" style="margin-top: 3rem;">
        <el-skeleton :animated="true">
            <template #template>
                <div style="
                 width:90vw;
                 margin-bottom:20px;
                display: flex;
                align-items: center;
                justify-items: space-between;
          "><el-skeleton-item variant="h1" style="width: 240px; height: 40px;margin-right:20px" />
                    <el-skeleton-item variant="h1" style="flex:1; height: 40px" />
                </div>
                <el-skeleton-item variant="p" style="width: 90vw ;height: 240px" />
            </template>
        </el-skeleton>
    </div>
</template>