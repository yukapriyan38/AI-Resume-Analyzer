const SkillTag = ({ skill, variant = "default" }) => {
  const variants = {
    default: "skill-tag",
    missing:
      "inline-block bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-full mr-1.5 mb-1.5",
  };

  return <span className={variants[variant]}>{skill}</span>;
};

export default SkillTag;
