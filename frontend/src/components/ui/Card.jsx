import PropTypes from 'prop-types';

function Card({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  noPadding = false,
  hover = false,
  ...props 
}) {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  const paddingClasses = noPadding ? '' : 'p-6';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`${noPadding ? 'p-6 pb-4' : 'pb-4'} border-b border-gray-200 dark:border-gray-700`}>
          {title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className={paddingClasses}>
        {children}
      </div>
      
      {footer && (
        <div className={`${noPadding ? 'px-6 py-4' : 'pt-4'} border-t border-gray-200 dark:border-gray-700`}>
          {footer}
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  hover: PropTypes.bool,
};

export default Card;
