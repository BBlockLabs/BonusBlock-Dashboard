<template>
  <el-card
    class="box-card filters-card"
    shadow="never"
  >
    <el-tabs
      :stretch="true"
      :model-value="tabOpened"
    >
      <el-tab-pane
        label="Filters"
        name="filters"
        class="filters-pane"
      >
        <el-row>
          <el-input
            v-model="filtersValues.search"
            placeholder="Search..."
          />
        </el-row>
        <template
          v-for="filter in filterOptions"
          :key="filter.id"
        >
          <el-row
            v-if="!filter.hidden || typeof filter.collapsableParent === 'undefined'"
            class="label"
          >
            <el-link
              :underline="false"
              @click="hideFilter(filter.id)"
            >
              <template v-if="filter.collapsable">
                <arrow-down
                  v-if="!filter.hidden"
                  class="icon"
                />
                <arrow-right
                  v-else
                  class="icon"
                />
              </template>
              {{ filter.title }}
            </el-link>
          </el-row>
          <template v-if="!filter.hidden">
            <el-row v-if="filter.type === 'text'">
              <el-input
                v-model="filtersValues[filter.id]"
                :placeholder="filter.placeholder"
              />
            </el-row>
            <slider-input
              v-if="filter.type === 'slider'"
              v-model="filtersValues[filter.id]"
              :min="filter.min"
              :max="filter.max"
              :step="filter.step"
            />
            <el-row v-else-if="filter.type === 'multiselect'">
              <el-select
                v-model="filtersValues[filter.id]"
                multiple
                :fit-input-width="true"
                size="large"
              >
                <el-option
                  v-for="option in filter.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </el-row>
            <el-row v-else-if="filter.type === 'checkbox'">
              <el-checkbox-group v-model="filtersValues[filter.id]">
                <el-checkbox
                  v-for="option in filter.options"
                  :key="option"
                  :label="option"
                  size="large"
                />
              </el-checkbox-group>
            </el-row>
          </template>
        </template>
        <el-row justify="center">
          <el-button
            round
            @click="resetFilters"
          >
            Reset
          </el-button>
        </el-row>
      </el-tab-pane>

      <el-tab-pane
        v-if="$store.getters['DeploymentModule/isCreateDeployment']"
        label="Selected"
        name="selected"
        class="selected-pane"
      >
        <h2>{{ selected.length }} Selected</h2>

        <template
          v-for="packageId in selected"
          :key="packageId"
        >
          <selected-package
            :selected-package="$store.getters['PackageModule/findById'](packageId)"
            @remove-selected="$emit('removeSelected', packageId)"
            @view-selected="$emit('viewSelected', packageId)"
          />
        </template>

        <el-row
          class="button-continue"
          justify="center"
        >
          <el-button
            round
            type="primary"
            @click="$emit('continueSelect')"
          >
            Continue
          </el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import SliderInput from '@/components/FilterSliderInput.vue';
import PackageFilter from '@/common/PackageFilter';
import {Formatter} from '@/common/Formatter';
import SelectedPackage from '@/components/SelectedPackage.vue';

export default {
  components: {
    SliderInput,
    SelectedPackage
  },
  props: {
    modelValue: {
      type: Object,
      default: () => new PackageFilter(),
    },
    filterOptions: {
      type: Object,
      default: () => ({})
    },
    selected: {
      type: Array,
      default: () => []
    },
    tabOpened: {
      type: String,
      default: 'filters'
    }
  },
  emits: [
    'update:modelValue',
    'removeSelected',
    'viewSelected',
    'continueSelect'
  ],
  data() {
    return {
      filtersValues: this.modelValue,
      defaultValues: new PackageFilter(),
    };
  },
  computed: {
    Formatter: () => Formatter,
  },
  watch: {
    filtersValues: {
      handler: function () {
        this.$emit('update:modelValue', this.filtersValues);
      },
      deep: true
    },
    modelValue() {
      this.filtersValues = this.modelValue;
    },
  },
  mounted() {
    this.filterOptions.map(o => o.hidden = false);
  },
  methods: {
    resetFilters() {
      console.log('ddfs');
      console.log(this.filtersValues);
      console.log(this.defaultValues);
      this.filtersValues = new PackageFilter();
    },
    hideFilter(id) {
      this.filterOptions.map(o => {
        if(o.collapsableParent && o.collapsableParent === id) {
          o.hidden = !o.hidden;
        }
        if(o.id === id) {
          o.hidden = !o.hidden;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@use "@/design/style/layout.scss";
@use '@/design/element-plus-theme.scss' as theme;

.filters-card {

  .el-card__body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0.75em;

    .el-tabs__content {
      padding-left: 1.5em;
      padding-right: 1.5em;
      padding-top: 1em;

      .filters-pane {
        .el-row {
          @extend .pb-2;
        }
        .el-slider {
          @extend .pb-2;
          @extend .mr-2;
        }
        .el-slider__button {
          background-color: #000;
        }
        .label {
          font-weight: bold !important;
          @extend .pt-2;
          @extend .pb-2;
          .el-link {
            font-weight: bold !important;
          }
          .icon {
            margin-right:0.2em;
          }
        }
        .el-select {
          width: 100%;
        }
        .el-checkbox {
          display: block;
          height: 2em;
          @extend .pl-2;
          .el-checkbox__inner {
            border-radius: .125em;
            top:1px;
          }
        }
      }
    }
  }
}
</style>
