import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const CategorySidebar = ({ categories = [], subCategories = [] }) => (
  <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
    <h2 className="px-2 pb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</h2>
    <div className="space-y-2">
      {categories.map((category) => {
        const children = subCategories.filter((item) => item.categoryId === category.id);

        return (
          <Accordion key={category.id} disableGutters elevation={0} className="rounded-xl border border-slate-100 before:hidden">
            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
              <Typography component="span" className="text-sm font-semibold text-slate-900">
                {category.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="space-y-2 pt-0">
              <Link to={`/products?category=${category.id}`} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                All {category.name}
              </Link>
              {children.map((subCategory) => (
                <Link
                  key={subCategory.id}
                  to={`/products?subcategory=${subCategory.id}`}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  {subCategory.name}
                </Link>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  </aside>
);

export default CategorySidebar;
