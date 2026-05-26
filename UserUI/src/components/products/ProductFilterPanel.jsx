import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProductFilterPanel = ({
  categories = [],
  subCategories = [],
  brands = [],
  filters = {},
  onFilterChange = () => {},
  onSortChange = () => {},
  onClearFilters = () => {},
}) => {
  const selectedCategory = categories.find((c) => c.id === Number(filters.category));
  const hasActiveFilters = filters.search || filters.category || filters.subcategory || filters.brand || filters.sort;

  // Keep category accordion open when a category is selected
  const [catExpanded, setCatExpanded] = useState(Boolean(filters.category));
  const [brandExpanded, setBrandExpanded] = useState(Boolean(filters.brand));

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:self-start lg:sticky lg:top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-950">Filters</h2>
        {hasActiveFilters && (
          <Button onClick={onClearFilters} size="small" color="inherit" sx={{ fontSize: 12 }}>
            Clear all
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Sort by</p>
        <FormControl component="fieldset" className="w-full">
          <RadioGroup
            value={filters.sort || ""}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <FormControlLabel value="" control={<Radio size="small" />} label={<span className="text-sm">Default</span>} />
            <FormControlLabel value="latest" control={<Radio size="small" />} label={<span className="text-sm">Latest</span>} />
            <FormControlLabel value="priceAsc" control={<Radio size="small" />} label={<span className="text-sm">Price: Low → High</span>} />
            <FormControlLabel value="priceDesc" control={<Radio size="small" />} label={<span className="text-sm">Price: High → Low</span>} />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Categories */}
      <Accordion
        disableGutters
        elevation={0}
        expanded={catExpanded}
        onChange={(_, open) => setCatExpanded(open)}
        className="rounded-2xl border border-slate-100 before:hidden"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
          <Typography component="span" className="text-sm font-semibold text-slate-900">
            Category
            {filters.category && (
              <span className="ml-2 rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                1
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-1 pt-0">
          {categories.map((category) => {
            const isActive = filters.category === String(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  onFilterChange(isActive ? { category: "" } : { category: category.id })
                }
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition
                  ${isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {category.name}
              </button>
            );
          })}

          {/* Subcategories — shown when a category is selected */}
          {selectedCategory && (
            <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {selectedCategory.name}
              </p>
              {subCategories
                .filter((sub) => sub.categoryId === selectedCategory.id)
                .map((sub) => {
                  const isSubActive = filters.subcategory === String(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        onFilterChange(isSubActive ? { subcategory: "" } : { subcategory: sub.id })
                      }
                      className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition
                        ${isSubActive ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Brands */}
      {brands.length > 0 && (
        <Accordion
          disableGutters
          elevation={0}
          expanded={brandExpanded}
          onChange={(_, open) => setBrandExpanded(open)}
          className="rounded-2xl border border-slate-100 before:hidden"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
            <Typography component="span" className="text-sm font-semibold text-slate-900">
              Brand
              {filters.brand && (
                <span className="ml-2 rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                  1
                </span>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="space-y-1 pt-0">
            {brands.map((brand) => {
              const isActive = filters.brand === String(brand.id);
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() =>
                    onFilterChange(isActive ? { brand: "" } : { brand: brand.id })
                  }
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition
                    ${isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {brand.name}
                </button>
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}
    </aside>
  );
};

export default ProductFilterPanel;
