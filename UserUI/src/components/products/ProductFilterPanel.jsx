import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProductFilterPanel = ({ categories = [], subCategories = [], brands = [], filters = {}, onFilterChange = () => {}, onSortChange = () => {}, onClearFilters = () => {} }) => {
  const selectedCategory = categories.find((category) => category.id === Number(filters.category));

  return (
    <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
          <Button onClick={onClearFilters} size="small">
            Clear
          </Button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Refine results by category, brand, and sort order.</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Sort</h3>
        <FormControl component="fieldset" className="w-full">
          <RadioGroup value={filters.sort || ""} onChange={(event) => onSortChange(event.target.value)}>
            <FormControlLabel value="latest" control={<Radio size="small" />} label="Latest" />
            <FormControlLabel value="priceAsc" control={<Radio size="small" />} label="Price: Low to High" />
            <FormControlLabel value="priceDesc" control={<Radio size="small" />} label="Price: High to Low" />
          </RadioGroup>
        </FormControl>
      </div>

      <Accordion disableGutters elevation={0} className="rounded-2xl border border-slate-100 before:hidden">
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
          <Typography component="span" className="text-sm font-semibold text-slate-900">
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-2 pt-0">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onFilterChange("category", category.id)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${filters.category === String(category.id) ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {category.name}
            </button>
          ))}
          {selectedCategory && (
            <div className="space-y-2 pt-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Subcategories</p>
              {subCategories
                .filter((sub) => sub.categoryId === selectedCategory.id)
                .map((subCategory) => (
                  <button
                    key={subCategory.id}
                    type="button"
                    onClick={() => onFilterChange("subcategory", subCategory.id)}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${filters.subcategory === String(subCategory.id) ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {subCategory.name}
                  </button>
                ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters elevation={0} className="rounded-2xl border border-slate-100 before:hidden">
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
          <Typography component="span" className="text-sm font-semibold text-slate-900">
            Brand
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-2 pt-0">
          {brands.slice(0, 10).map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => onFilterChange("brand", brand.id)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${filters.brand === String(brand.id) ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {brand.name}
            </button>
          ))}
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};

export default ProductFilterPanel;
